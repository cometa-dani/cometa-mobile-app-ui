/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage, Avatar } from 'react-native-gifted-chat';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
import { Unsubscribe } from 'firebase/auth';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetFriendshipByTargetUserID } from '../../queries/loggedInUser/friendshipHooks';
// firebase
import { realtimeDB } from '../../firebase/firebase';
import { limitToLast, onChildAdded, query, ref } from 'firebase/database';
import chatWithFriendService from '../../services/chatWithFriendService';
import { useMMKVListener, useMMKV } from 'react-native-mmkv';
import { UserMessagesData } from '../../store/slices/messagesSlices';


type ChatWithFriendMessage = Map<string | number, IMessage>

export default function ChatWithFriendScreen(): JSX.Element {
  const { text } = useColors();
  const mmkvStorage = useMMKV();

  // users ids
  const targetUserUUID = useLocalSearchParams<{ friendUuid: string }>()['friendUuid']; // TODO: can be uuid
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const { data: friendshipData } = useQueryGetFriendshipByTargetUserID(targetUserUUID);
  const sender = friendshipData?.sender;
  const receiver = friendshipData?.receiver;

  // users profiles
  const targetUser = sender?.uid === targetUserUUID ? sender : receiver;
  const loggedInUser = sender?.uid !== targetUserUUID ? sender : receiver;
  const [messages, setMessages] = useState<ChatWithFriendMessage>(new Map([]));
  const chatRef = useRef<FlatList<IMessage>>(null);
  const [messagesHaveBeenRead, setMessagesHaveBeenRead] = useState(false);

  // listen only for chatuuid changes
  useMMKVListener((key: string) => {
    if (key === friendshipData?.chatuuid) {
      const updateMap: [] = JSON.parse(mmkvStorage.getString(friendshipData?.chatuuid) ?? '[]');
      setMessages(new Map(updateMap));
    }
  });


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
      if (friendshipData?.chatuuid && loggedInUser && targetUser) {
        await chatWithFriendService.writeMessage(
          friendshipData.chatuuid,
          messagePayload,
          loggedInUser,
          targetUser
        );
      }
    }
    catch {
      return null;
    }
  }, [friendshipData?.chatuuid]);


  // load messages from local storage on first render
  useEffect(() => {
    if (friendshipData?.chatuuid && !messagesHaveBeenRead) {
      const localMessages: [] = JSON.parse(mmkvStorage.getString(friendshipData?.chatuuid) ?? '[]');
      setMessages(new Map(localMessages));
      setMessagesHaveBeenRead(true);
    }
  }, [friendshipData?.chatuuid]);


  // listen for new added messages in real-time DB
  useEffect(() => {
    if (!messagesHaveBeenRead) return;

    let unsubscribe!: Unsubscribe;
    if (friendshipData?.chatuuid) {
      const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}/${loggedInUserUuid}`);
      const queryMessages = query(chatsRef, limitToLast(20)); // we can use the number of new messages

      unsubscribe = onChildAdded(queryMessages, (data) => {
        const newMessage = data?.val() as UserMessagesData;
        const localMessages: [] = JSON.parse(mmkvStorage.getString(friendshipData?.chatuuid) ?? '[]');
        const addNewMessage = () => JSON.stringify([...localMessages, [newMessage._id, newMessage]]);

        mmkvStorage.set(friendshipData?.chatuuid, addNewMessage());
      });
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [messagesHaveBeenRead]);


  useEffect(() => {
    setTimeout(() => {
      chatRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [messages.size]);


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
              <TouchableOpacity onPress={() => router.push(`/targetUserProfile/${targetUser?.uid}?isFriend=true`)}>
                <View style={styles.targetUser}>
                  <ImageWithPlaceholder
                    style={styles.avatarImg}
                    source={{ uri: targetUser?.photos[0]?.url }}
                    placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
                  />

                  <View>
                    <Text style={styles.avatarName}>{targetUser?.username}</Text>
                    {/* <Text>online</Text> */}
                  </View>
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <View style={styles.container}>
        <GiftedChat
          scrollToBottom={true}
          messageContainerRef={chatRef}
          alwaysShowSend={true}
          inverted={false}
          renderFooter={() => (
            <View style={{ height: 30 }} />
          )}
          renderBubble={(props) => (
            <Bubble
              {...props}
              user={props.user}
              key={props.currentMessage?._id}
              textStyle={{
                right: { color: text, fontFamily: 'Poppins' },
                left: { color: text, fontFamily: 'Poppins' }
              }}
              // bottomContainerStyle={{ right: { height: 30, marginBottom: 20 }, left: { height: 30, marginBottom: 20 } }}
              wrapperStyle={{
                right: {
                  backgroundColor: '#ead4fa',
                  padding: 8,
                  borderRadius: 24,
                  marginRight: -10,
                  minWidth: '50%',
                  maxWidth: '85%',
                  // marginBottom: 20
                },
                left: {
                  backgroundColor: '#f0f0f0', padding: 8, borderRadius: 24
                }
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
          messages={[...messages.values()]}
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
    marginBottom: -2,
    textTransform: 'capitalize'
  },

  targetUser: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginLeft: -16
  },

  container: {
    flex: 1,
  }
});
