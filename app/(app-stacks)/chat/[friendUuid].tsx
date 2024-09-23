/* eslint-disable react/prop-types */
import { useCallback, useMemo, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, Avatar, Message } from 'react-native-gifted-chat';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, useColors } from '../../../components/Themed';
import { Stack, useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView, RefreshControl } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
import { useCometaStore } from '../../../store/cometaStore';
import { useQueryGetFriendshipByTargetUserID } from '../../../queries/loggedInUser/friendshipHooks';
// firebase
import { realtimeDB } from '../../../config/firebase/firebase';
import { limitToLast, query, ref, onValue, endBefore } from 'firebase/database';
import chatWithFriendService from '../../../services/chatWithFriendService';
import { UserMessagesData } from '../../../store/slices/messagesSlices';
import { Entypo } from '@expo/vector-icons';
import { blue_100, gray_50 } from '../../../constants/colors';
import { If } from '../../../components/utils';


type ChatWithFriendMessage = Map<string | number, UserMessagesData>
const take = 20;

export default function ChatWithFriendScreen(): JSX.Element {
  const { text } = useColors();
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
  const messagesList = useMemo(() => [...messages.values()], [messages]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNoMoreMessagesToLoad, setHasNoMoreMessagesToLoad] = useState(false);
  const chatRef = useRef<FlatList<IMessage> | null>(null);


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


  const handleRefreshControl = () => {
    if (!isLoadingMore && !hasNoMoreMessagesToLoad) {
      setIsLoadingMore(true);
      const lastMessageKey = messagesList.at(0)?.messageUUID;
      if (!lastMessageKey) {
        setHasNoMoreMessagesToLoad(true);
        setIsLoadingMore(false);
        return;
      }
      const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}/${loggedInUserUuid}`);
      const queryMessages = query(chatsRef, limitToLast(take), endBefore(null, lastMessageKey)); // max average number of messages

      onValue(queryMessages, (snapshot) => {
        const previousMessagesMap = new Map<string, UserMessagesData>([]);

        snapshot.forEach(data => {
          const newMessage = {
            ...data?.val(),
            messageUUID: data?.key ?? ''
          } as UserMessagesData;

          previousMessagesMap.set(newMessage._id.toString(), newMessage);
        });

        if (previousMessagesMap.size < take) {
          setHasNoMoreMessagesToLoad(true);
        }

        setMessages(curr => new Map([
          ...previousMessagesMap.entries(),  // adds previous messages to the beginning
          ...curr.entries(),
        ]));

        setTimeout(() => {
          setIsLoadingMore(false);
        }, 200);
      },
        { onlyOnce: true }
      );
    }
  };


  // when the user has an unviewed new message
  useFocusEffect(useCallback(() => {
    if (messagesList.length) {
      const lastMessage = messagesList.at(-1);
      if (
        loggedInUserUuid !== lastMessage?.user?._id
        && lastMessage
        && !lastMessage?.received
        && friendshipData?.chatuuid
        && targetUser
      ) {
        chatWithFriendService.setMessageAsViewed(
          friendshipData?.chatuuid,
          loggedInUserUuid,
          targetUser,
          lastMessage,
          messagesList.filter(message => !message.received) ?? []
        );
      }

      setTimeout(() => {
        chatRef.current?.scrollToEnd({ animated: true });
      }, 400);
    }

  }, [messagesList]));


  // listens for new added/updated messages in real-time DB
  useFocusEffect(
    useCallback(() => {
      if (friendshipData?.chatuuid && !messages.size) {
        const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}/${loggedInUserUuid}`);
        const queryMessages = query(chatsRef, limitToLast(take));

        const unsubscribeOnDelete = onValue(ref(realtimeDB, `chats/${friendshipData?.chatuuid}`), (snapshot) => {
          if (!snapshot.exists()) {
            if (router.canGoBack()) {
              router.back();  // closes the chat if it doesn't exist (when two users are no longer friends)
            }
          }
        });

        const unsubscribeOnChange = onValue(queryMessages, (snapshot) => {
          const newMessagesMap = new Map<string, UserMessagesData>([]);

          snapshot.forEach(data => {
            const newMessage = {
              ...data?.val(),
              messageUUID: data?.key ?? ''
            } as UserMessagesData;

            newMessagesMap.set(newMessage._id.toString(), newMessage);
          });

          setMessages(prev => new Map([
            ...prev.entries(),
            ...newMessagesMap.entries() // adds new messages to the end
          ]));
        });

        return () => {
          unsubscribeOnChange();
          unsubscribeOnDelete();
        };
      }
    }, [friendshipData?.chatuuid])
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          headerTitle: () => {
            return (
              <TouchableOpacity
                onPress={() => router.push(`/targetUserProfile/${targetUser?.uid}?chatuuid=${friendshipData?.chatuuid}`)}
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
          messages={messagesList}
          onSend={(messages) => onSendMessage(messages)}
          showUserAvatar={true}
          user={{
            _id: loggedInUserUuid,
            name: loggedInUser?.username,
            avatar: loggedInUser?.photos[0]?.url
          }}
          // loadEarlier={!hasNoMoreMessagesToLoad && !isLoadingMore}
          listViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={isLoadingMore}
                onRefresh={handleRefreshControl}
              />
            )
          }}
          messageContainerRef={isLoadingMore ? undefined : chatRef}
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
            if (!targetUser?.uid || !loggedInUser?.uid) {
              return null;
            }
            const avatarProps = {
              ...props,
              currentMessage: {
                // ...props.currentMessage,
                user: {
                  ...props.currentMessage?.user,
                  avatar: props.currentMessage?.user?._id === targetUser?.uid
                    ? targetUser?.photos[0]?.url
                    : loggedInUser?.photos[0]?.url
                }
              } as IMessage,
            };
            return (
              <Avatar
                position='right'
                key={props.currentMessage?._id ?? -1}
                currentMessage={avatarProps.currentMessage}
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
