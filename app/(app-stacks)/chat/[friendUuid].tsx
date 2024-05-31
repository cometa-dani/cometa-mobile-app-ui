/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage, Avatar, Message } from 'react-native-gifted-chat';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, useColors } from '../../../components/Themed';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
import { Unsubscribe } from 'firebase/auth';
import { useCometaStore } from '../../../store/cometaStore';
import { useQueryGetFriendshipByTargetUserID } from '../../../queries/loggedInUser/friendshipHooks';
// firebase
import { realtimeDB } from '../../../config/firebase/firebase';
import { limitToLast, query, ref, onValue } from 'firebase/database';
import chatWithFriendService from '../../../services/chatWithFriendService';
import { useMMKVListener, useMMKV } from 'react-native-mmkv';
import { UserMessagesData } from '../../../store/slices/messagesSlices';
import { Entypo } from '@expo/vector-icons';
import { blue_100, gray_50 } from '../../../constants/colors';
import { If } from '../../../components/utils';


type ChatWithFriendMessage = Map<string | number, UserMessagesData>

export default function ChatWithFriendScreen(): JSX.Element {
  const { text } = useColors();
  const mmkvStorage = useMMKV();
  // mmkvStorage.clearAll();

  // users ids
  const targetUserUUID = useLocalSearchParams<{ friendUuid: string }>()['friendUuid']; // TODO: can be uuid
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const { data: friendshipData } = useQueryGetFriendshipByTargetUserID(targetUserUUID);
  const sender = friendshipData?.sender;
  const receiver = friendshipData?.receiver;

  // users profiles
  const targetUser = sender?.uid === targetUserUUID ? sender : receiver;
  const loggedInUser = sender?.uid !== targetUserUUID ? sender : receiver;
  const LOCAL_CHAT_KEY = `${loggedInUserUuid}.chats.${friendshipData?.chatuuid}`;
  const [messages, setMessages] = useState<ChatWithFriendMessage>(new Map([]));
  const chatRef = useRef<FlatList<IMessage>>(null);
  const [localMessagesHaveBeenRead, setLocalMessagesHaveBeenRead] = useState(false);

  // listen only for chatuuid changes
  useMMKVListener((key: string) => {
    if (key === LOCAL_CHAT_KEY) {
      setMessages(new Map(getLocalMessages()));
    }
  });


  const onSendMessage = useCallback(async (messages: IMessage[] = []) => {
    try {
      const senderMessage = messages[0];
      const messagePayload = {
        ...senderMessage,
        sent: false,
        received: false,
        user: {
          _id: loggedInUserUuid,
        }
      };
      if (friendshipData?.chatuuid && loggedInUser && targetUser) {
        // 1. should be written locally {sent: false, received: false}
        addNewLocalMessage(messagePayload, getLocalMessages());
        // 2. should be written in firebase and available for both users
        //  {sent: true, received: false}

        await chatWithFriendService.writeMessage(
          friendshipData.chatuuid,
          { ...messagePayload, sent: true },
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
    if (friendshipData?.chatuuid && !localMessagesHaveBeenRead) {
      setMessages(new Map(getLocalMessages()));
      setLocalMessagesHaveBeenRead(true);
    }
  }, [friendshipData?.chatuuid]);


  function getLocalMessages(): [] {
    return JSON.parse(mmkvStorage.getString(LOCAL_CHAT_KEY) ?? '[]');
  }

  function addNewLocalMessage<T>(message: UserMessagesData | IMessage, localMessages: T[]) {
    const newMessage = JSON.stringify([...localMessages, [message._id, message]]);
    mmkvStorage.set(LOCAL_CHAT_KEY, newMessage);
  }

  // listen for new added messages in real-time DB
  useEffect(() => {
    let unsubscribe!: Unsubscribe;
    if (!localMessagesHaveBeenRead) return;
    if (friendshipData?.chatuuid) {
      const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}/${loggedInUserUuid}`);
      const queryMessages = query(chatsRef, limitToLast(20)); // we can use the number of new messages

      onValue(queryMessages, (snapshot) => {
        const localMessages = getLocalMessages();
        const messagesMap = new Map<string, UserMessagesData>(localMessages);

        snapshot.forEach(data => {
          const newMessage = { ...data?.val() as UserMessagesData, messageUUID: data?.key ?? '' };
          messagesMap.set(newMessage._id.toString(), newMessage);
        });

        mmkvStorage.set(LOCAL_CHAT_KEY, JSON.stringify([...messagesMap.entries()]));
      });
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [localMessagesHaveBeenRead]);


  useEffect(() => {
    if (localMessagesHaveBeenRead) {
      const timeOutId = setTimeout(() => {
        chatRef.current?.scrollToEnd({ animated: true });
      }, 80);
      // console.log(chatRef.current?.recordInteraction());


      const lastMessage = [...messages.values()].at(-1);
      if (loggedInUserUuid !== lastMessage?.user._id && lastMessage && !lastMessage.received) {
        chatWithFriendService.setMessageAsViewed(friendshipData?.chatuuid ?? '', loggedInUserUuid, targetUserUUID, lastMessage);
      }

      return () => clearTimeout(timeOutId);
    }
  }, [messages.size, localMessagesHaveBeenRead]);


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          headerTitle: () => {
            return (
              <TouchableOpacity
                onPress={() => router.push(`/targetUserProfile/${targetUser?.uid}`)}
              >
                <View style={styles.targetUser}>
                  <ImageWithPlaceholder
                    style={styles.avatarImg}
                    source={{ uri: targetUser?.photos[0]?.url }}
                    placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
                  />

                  <View>
                    <Text style={styles.avatarName}>{targetUser?.username}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <View style={styles.container}>
        <GiftedChat
          // isLoadingEarlier={true}
          loadEarlier={true}
          infiniteScroll={true}
          // listViewProps={{
          //   onEndReached: () => console.log('end reached'),
          //   onScroll: () => console.log('top'),
          //   scrollsToTop: false
          // }}
          // renderLoadEarlier={(props) => (
          //   <LoadEarlier
          //     onLoadEarlier={() => console.log('load earlier')}
          //     {...props}
          //   />
          // )}
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
              renderTicks={(message) => (
                <If
                  condition={message.user._id === loggedInUserUuid}
                  render={(
                    <>
                      <Entypo
                        name="check"
                        size={13.6}
                        color={message.sent ? blue_100 : gray_50}
                      />
                      <Entypo
                        style={{ marginLeft: -6 }}
                        name="check"
                        size={13.6}
                        color={message.received ? blue_100 : gray_50}
                      />
                    </>
                  )}
                />
              )}
              key={props.currentMessage?._id}
              textStyle={{
                right: { color: text, fontFamily: 'Poppins' },
                left: { color: text, fontFamily: 'Poppins' }
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: '#ead4fa',
                  padding: 8,
                  borderRadius: 24,
                  marginRight: -10,
                  minWidth: '50%',
                  maxWidth: '85%',
                },
                left: {
                  backgroundColor: '#f0f0f0', padding: 8, borderRadius: 24
                }
              }}
            />
          )}
          renderMessage={(props) => (
            <Message  {...props} />
          )}
          renderAvatar={(props) => {
            const avatarProps = {
              ...props,
              currentMessage: {
                ...props.currentMessage,
                user: {
                  ...props.currentMessage?.user,
                  avatar:
                    props.currentMessage?.user?._id === targetUser?.uid ?
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

          messages={[...messages.values()].slice(-20)}
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
