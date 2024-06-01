/* eslint-disable react/prop-types */
import { useCallback, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage, Avatar, Message } from 'react-native-gifted-chat';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, useColors } from '../../../components/Themed';
import { Stack, useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
import { Unsubscribe } from 'firebase/auth';
import { useCometaStore } from '../../../store/cometaStore';
import { useQueryGetFriendshipByTargetUserID } from '../../../queries/loggedInUser/friendshipHooks';
// firebase
import { realtimeDB } from '../../../config/firebase/firebase';
import { limitToLast, query, ref, onValue } from 'firebase/database';
import chatWithFriendService from '../../../services/chatWithFriendService';
import { useMMKV } from 'react-native-mmkv';
import { UserMessagesData } from '../../../store/slices/messagesSlices';
import { Entypo } from '@expo/vector-icons';
import { blue_100, gray_50 } from '../../../constants/colors';
import { If } from '../../../components/utils';


type ChatWithFriendMessage = Map<string | number, UserMessagesData>

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
  const LOCAL_CHAT_KEY = `${loggedInUserUuid}.chats.${friendshipData?.chatuuid}`;
  const [messages, setMessages] = useState<ChatWithFriendMessage>(new Map([]));
  const chatRef = useRef<FlatList<IMessage>>(null);
  const [localMessagesHaveBeenRead, setLocalMessagesHaveBeenRead] = useState(false);


  function getLocalMessages(): [] {
    return JSON.parse(mmkvStorage.getString(LOCAL_CHAT_KEY) ?? '[]');
  }


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
      } as UserMessagesData;
      if (friendshipData?.chatuuid && loggedInUser && targetUser) {
        setMessages(prevMap => {
          const prevMapCopy = new Map(prevMap);
          prevMapCopy.set(messagePayload._id.toString(), messagePayload);
          return prevMapCopy;
        });
        setTimeout(() => {
          chatRef.current?.scrollToEnd({ animated: true });
        }, 150);

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
  }, [friendshipData?.chatuuid, targetUser]);


  // load messages from local storage on first render
  useFocusEffect(
    useCallback(() => {
      if (friendshipData?.chatuuid && !localMessagesHaveBeenRead) {
        setMessages(new Map(getLocalMessages()));
        setLocalMessagesHaveBeenRead(true);
        const timeOutId = setTimeout(() => {
          chatRef.current?.scrollToEnd({ animated: true });
        }, 500);

        return () => clearTimeout(timeOutId);
      }
    }, [friendshipData?.chatuuid])
  );


  // stores all the latest messages in disk when the user leaves the screen
  useFocusEffect(useCallback(() => {
    return () => mmkvStorage.set(LOCAL_CHAT_KEY, JSON.stringify([...messages.entries()]));
  }, [messages]));


  // listen for new added messages in real-time DB
  useFocusEffect(
    useCallback(() => {
      let unsubscribe!: Unsubscribe;
      if (!localMessagesHaveBeenRead) return;
      if (friendshipData?.chatuuid) {
        const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}/${loggedInUserUuid}`);
        const queryMessages = query(chatsRef, limitToLast(15)); // max average number of messages

        unsubscribe = onValue(queryMessages, (snapshot) => {
          const messagesMap = new Map<string, UserMessagesData>([]);

          snapshot.forEach(data => {
            const newMessage = { ...data?.val() as UserMessagesData, messageUUID: data?.key ?? '' };
            messagesMap.set(newMessage._id.toString(), newMessage);
          });

          setMessages(prev => new Map([
            ...prev.entries(), ...messagesMap.entries()
          ]));
        });
      }
      return () => {
        unsubscribe && unsubscribe();
      };
    }, [localMessagesHaveBeenRead])
  );


  // sets the latest message as viewed
  useFocusEffect(
    useCallback(() => {
      if (localMessagesHaveBeenRead) {
        const lastMessage = [...messages.values()].at(-1);
        if (
          loggedInUserUuid !== lastMessage?.user._id
          && lastMessage
          && !lastMessage.received
          && friendshipData?.chatuuid
          && targetUser
        ) {
          chatWithFriendService.setMessageAsViewed(
            friendshipData?.chatuuid,
            loggedInUserUuid,
            targetUser,
            lastMessage
          );
        }
      }
    }, [messages.size, localMessagesHaveBeenRead])
  );


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
          messages={[...messages.values()].slice(-20)}
          onSend={(messages) => onSendMessage(messages)}
          showUserAvatar={true}
          user={{
            _id: loggedInUserUuid,
            name: loggedInUser?.username,
            avatar: loggedInUser?.photos[0]?.url
          }}
          loadEarlier={true}
          infiniteScroll={true}
          // isLoadingEarlier={true}
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
