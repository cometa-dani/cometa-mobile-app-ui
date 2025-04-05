/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage, Avatar } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { Text, View, useColors } from '../../../legacy_components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
import { Unsubscribe } from 'firebase/auth';
import { useCometaStore } from '../../../store/cometaStore';
import { useQueryGetChatGroupByID } from '../../../queries/currentUser/chatGroupsHooks';
import { useQueryGetUserProfile } from '../../../queries/currentUser/userHooks';
import { If } from '../../../legacy_components/utils';
import { FontAwesome5 } from '@expo/vector-icons';
import { gray_900 } from '../../../constants/colors';
// firebase
import { realtimeDB } from '../../../config/firebase/firebase';
import { limitToLast, onChildAdded, query, ref } from 'firebase/database';
import { IGetBasicUserProfile } from '../../../models/User';
import chatWithGroupService from '../../../services/chatWithGroupService';


export default function ChatGroupScreen(): JSX.Element {
  const { text } = useColors();

  const chatgroupUUID = useLocalSearchParams<{ groupUuid: string }>()['groupUuid']; // TODO: can be uuid
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const { data: loggedInUser } = useQueryGetUserProfile(loggedInUserUuid);
  const { data: targetChatGroup } = useQueryGetChatGroupByID(chatgroupUUID);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const targetChatGroupMembers: Map<string, IGetBasicUserProfile> = useMemo(() => (
    new Map(Object.entries(targetChatGroup?.members ?? {}))
  ), [targetChatGroup?.members]);


  const onSendMessage = useCallback(async (messages: IMessage[] = []) => {
    try {
      const senderMessage = messages[0];
      const messagePayload = {
        ...senderMessage,
        createdAt: new Date().toString(),
        user: {
          _id: loggedInUserUuid,
        }
      };
      if (loggedInUserUuid && targetChatGroup?.members) {
        const chatGroupData = {
          name: targetChatGroup?.name,
          photo: targetChatGroup?.photo?.url ?? '',
          uuid: targetChatGroup?.id
        };
        await chatWithGroupService.writeMessage(
          messagePayload,
          loggedInUserUuid,
          [...targetChatGroupMembers.keys()],
          chatGroupData
        );
      }
    }
    catch {
      return null;
    }
  }, [targetChatGroup?.id, targetChatGroupMembers.size]);


  // listen for new added messages
  useEffect(() => {
    let unsubscribe!: Unsubscribe;
    if (targetChatGroup?.id) {
      const chatsRef = ref(realtimeDB, `chats/${targetChatGroup.id}`);
      const queryMessages = query(chatsRef, limitToLast(18));

      unsubscribe = onChildAdded(queryMessages, (data) => {
        const newMessage = data?.val() as IMessage;
        setMessages(prev => prev.concat(newMessage));
      });
    }
    return () => {
      messages && setMessages([]);
      unsubscribe && unsubscribe();
    };
  }, [targetChatGroup?.id]);


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          presentation: 'modal',
          headerTitle: () => {
            return (
              <View style={styles.targetUser}>
                <If
                  condition={targetChatGroup?.photo?.url}
                  render={(
                    <ImageWithPlaceholder
                      style={styles.avatarImg}
                      source={{ uri: targetChatGroup?.photo?.url }}
                    />
                  )}
                  elseRender={(
                    <FontAwesome5
                      style={styles.avatarImg}
                      name="users"
                      size={26}
                      color={gray_900}
                    />
                  )}
                />

                <View>
                  <Text style={styles.avatarName}>{targetChatGroup?.name}</Text>
                  <Text>online</Text>
                </View>
              </View>
            );
          },
        }}
      />

      <View style={styles.container}>
        <GiftedChat
          alwaysShowSend={true}
          inverted={false}
          renderBubble={(props) => (
            <Bubble
              {...props}
              user={props.user}
              key={props.currentMessage?._id}
              textStyle={{
                right: { color: text },
                left: { color: text }
              }}
              wrapperStyle={{
                right: { backgroundColor: '#ead4fa', padding: 8, borderRadius: 24, marginRight: -10, minWidth: '50%', maxWidth: '85%' },
                left: { backgroundColor: '#f0f0f0', padding: 8, borderRadius: 24 }
              }}
            />
          )}
          renderAvatar={(props) => {
            const currentMessage = props.currentMessage;
            const currUserID = currentMessage?.user?._id as string;
            const avatarProps = {
              ...props,
              currentMessage: {
                ...currentMessage,
                user: {
                  ...currentMessage?.user,
                  avatar:
                    currUserID !== loggedInUserUuid ?
                      targetChatGroupMembers.get(currUserID)?.photos[0]?.url
                      : loggedInUser?.photos[0]?.url
                }
              } as IMessage
            };

            return (
              <Avatar
                key={props.currentMessage?._id ?? -1}
                {...avatarProps}
              />
            );
          }}
          // isTyping={true} // shows typing indicator
          messages={messages}
          onSend={(messages) => onSendMessage(messages)}
          showUserAvatar={true}
          user={{
            _id: loggedInUserUuid,
            name: loggedInUser?.username,
            avatar: loggedInUser?.photos[0]?.url
          }}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  avatarImg: {
    aspectRatio: 1,
    borderRadius: 100,
    height: 36
  },

  avatarName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: -2,
    textTransform: 'capitalize'
  },

  container: {
    flex: 1,
  },

  targetUser: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginLeft: -16
  }
});
