/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage, Avatar } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
import { Unsubscribe } from 'firebase/auth';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetFriendshipByTargetUserID } from '../../queries/loggedInUser/friendshipHooks';
// firebase
import { realtimeDB } from '../../firebase/firebase';
import { limitToLast, onChildAdded, query, ref } from 'firebase/database';
import { writeToRealTimeDB } from '../../firebase/writeToRealTimeDB';


export default function ChatScreen(): JSX.Element {
  const { text } = useColors();

  // users ids
  const targetUserUUID = useLocalSearchParams<{ friend: string }>()['friend']; // TODO: can be uuid
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const { data: friendshipData } = useQueryGetFriendshipByTargetUserID(targetUserUUID);
  const sender = friendshipData?.sender;
  const receiver = friendshipData?.receiver;

  // users profiles
  const targetUser = sender?.uid === targetUserUUID ? sender : receiver;
  const loggedInUser = sender?.uid !== targetUserUUID ? sender : receiver;
  const [messages, setMessages] = useState<IMessage[]>([]);


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
      if (friendshipData?.chatuuid && loggedInUser) {
        await writeToRealTimeDB(
          friendshipData.chatuuid,
          messagePayload,
          loggedInUser,
          targetUserUUID
        );
      }
    }
    catch {
      return null;
    }
  }, [friendshipData?.chatuuid]);


  // listen for new added messages
  useEffect(() => {
    let unsubscribe!: Unsubscribe;
    if (friendshipData?.chatuuid) {
      const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}`);
      const queryMessages = query(chatsRef, limitToLast(12));

      unsubscribe = onChildAdded(queryMessages, (data) => {
        const newMessage = data.val() as IMessage;
        setMessages(prev => prev.concat(newMessage));
      });
    }
    return () => {
      messages && setMessages([]);
      unsubscribe && unsubscribe();
    };
  }, [friendshipData?.chatuuid]);


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <View style={styles.avatarReciever}>
              <FontAwesome name='arrow-down' size={24} onPress={() => router.back()} />
              <ImageWithPlaceholder
                style={styles.avatarImg}
                source={{ uri: targetUser?.photos[0]?.url }}
                placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
              />

              <View>
                <Text style={styles.avatarName}>{targetUser?.username}</Text>
                <Text>online</Text>
              </View>
            </View>
          )
        }} />

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
            const avatarProps = {
              ...props,
              currentMessage: {
                ...props.currentMessage,
                user: {
                  ...props.currentMessage?.user,
                  avatar:
                    props.currentMessage?.user._id === targetUser?.uid ?
                      targetUser?.photos[0]?.url : loggedInUser?.photos[0]?.url
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

  avatarReciever: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14
  },

  container: {
    // paddingTop: 20,
    flex: 1,
  }
});
