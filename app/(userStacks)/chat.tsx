/* eslint-disable react/prop-types */
import { ReactNode, useCallback, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, Avatar, Message } from 'react-native-gifted-chat';
import { FlatList, TouchableOpacity, View, RefreshControl, SafeAreaView } from 'react-native';
// import { Text, View, useColors } from '../../../legacy_components/Themed';
import { Stack, useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { Image as ImageWithPlaceholder } from 'expo-image';
// import { useCometaStore } from '../../../store/cometaStore';
// import { useQueryGetFriendshipByTargetUserID } from '../../../queries/currentUser/friendshipHooks';
// firebase
// import { realtimeDB } from '../../../config/firebase/firebase';
// import { limitToLast, query, ref, onValue, endBefore } from 'firebase/database';
// import chatWithFriendService from '../../../services/chatWithFriendService';
// import { UserMessagesData } from '../../../store/slices/messagesSlices';
import { Entypo } from '@expo/vector-icons';
import { TextView } from '@/components/text/text';
import { useCometaStore } from '@/store/cometaStore';
// import { UserMessagesData } from '@/store/slices/messagesSlices';
// import { useQueryGetFriendshipByTargetUserID } from '@/queries/currentUser/friendshipHooks';
import { Condition } from '@/components/utils/ifElse';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { HStack } from '@/components/utils/stacks';
import { useMessages } from '@/queries/chat/useMessages';
// import { If } from '@/legacy_components/utils';
// import { blue_100, gray_50 } from '../../../constants/colors';
// import { If } from '../../../legacy_components/utils';


// type ChatWithFriendMessage = Map<string | number, UserMessagesData>
// const take = 20;

export default function ChatWithFriendScreen(): ReactNode {
  // const { text } = useColors();
  // users ids
  const { theme, styles } = useStyles(styleSheet);
  const { friendshipId } = useGlobalSearchParams<{ friendshipId: string }>();
  const targetUser = useCometaStore(state => state.targetUser);
  const currentUser = useCometaStore(state => state.userProfile);
  const { messages, sendMessage } = useMessages(+friendshipId);
  // const { data: friendshipData } = useQueryGetFriendshipByTargetUserID(friendUuid);
  // const sender = friendshipData?.sender;
  // const receiver = friendshipData?.receiver;

  // users profiles
  // const targetUser = sender?.uid === targetUserUUID ? sender : receiver;
  // const loggedInUser = sender?.uid !== targetUserUUID ? sender : receiver;
  // const [messages, setMessages] = useState<ChatWithFriendMessage>(new Map([]));
  // const messagesList = useMemo(() => [...messages.values()], [messages]);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // const [hasNoMoreMessagesToLoad, setHasNoMoreMessagesToLoad] = useState(false);
  const chatRef = useRef<FlatList<IMessage> | null>(null);


  const onSendMessage = useCallback(async (messages: IMessage[] = []) => {
    try {
      const senderMessage = messages[0];
      const messagePayload = {
        ...senderMessage,
        sent: false,
        received: false,
        user: {
          _id: currentUser?.id,
        }
      } as IMessage;
      sendMessage(messagePayload);
      // if (friendshipData?.chatuuid && loggedInUser && targetUser) {
      //   setMessages(prevMap => {
      //     const prevMapCopy = new Map(prevMap);
      //     prevMapCopy.set(messagePayload._id.toString(), messagePayload);
      //     return prevMapCopy;
      //   });
      //   await chatWithFriendService.writeMessage(
      //     friendshipData.chatuuid,
      //     { ...messagePayload, sent: true },
      //     loggedInUser,
      //     targetUser
      //   );
      // }
    }
    catch {
      return null;
    }
  }, [currentUser?.id]);


  const handleRefreshControl = () => {
    // if (!isLoadingMore && !hasNoMoreMessagesToLoad) {
    //   setIsLoadingMore(true);
    //   const lastMessageKey = messages.at(0)?._id;
    //   if (!lastMessageKey) {
    //     setHasNoMoreMessagesToLoad(true);
    //     setIsLoadingMore(false);
    //     return;
    //   }
    // const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}/${loggedInUserUuid}`);
    // const queryMessages = query(chatsRef, limitToLast(take), endBefore(null, lastMessageKey)); // max average number of messages

    // onValue(queryMessages, (snapshot) => {
    //   const previousMessagesMap = new Map<string, UserMessagesData>([]);

    //   snapshot.forEach(data => {
    //     const newMessage = {
    //       ...data?.val(),
    //       messageUUID: data?.key ?? ''
    //     } as UserMessagesData;

    //     previousMessagesMap.set(newMessage._id.toString(), newMessage);
    //   });

    //   if (previousMessagesMap.size < take) {
    //     setHasNoMoreMessagesToLoad(true);
    //   }

    //   setMessages(curr => new Map([
    //     ...previousMessagesMap.entries(),  // adds previous messages to the beginning
    //     ...curr.entries(),
    //   ]));

    //   setTimeout(() => {
    //     setIsLoadingMore(false);
    //   }, 200);
    // },
    //   { onlyOnce: true }
    // );
    // }
  };


  // when the user has an unviewed new message
  useFocusEffect(useCallback(() => {
    // if (messagesList.length) {
    //   const lastMessage = messagesList.at(-1);
    //   if (
    //     loggedInUserUuid !== lastMessage?.user?._id
    //     && lastMessage
    //     && !lastMessage?.received
    //     && friendshipData?.chatuuid
    //     && targetUser
    //   ) {
    //     chatWithFriendService.setMessageAsViewed(
    //       friendshipData?.chatuuid,
    //       loggedInUserUuid,
    //       targetUser,
    //       lastMessage,
    //       messagesList.filter(message => !message.received) ?? []
    //     );
    //   }

    //   setTimeout(() => {
    //     chatRef.current?.scrollToEnd({ animated: true });
    //   }, 400);
    // }

  }, [messages]));


  // listens for new added/updated messages in real-time DB
  // useFocusEffect(
  //   useCallback(() => {
  //     if (friendshipData?.chatuuid && !messages.size) {
  //       const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}/${loggedInUserUuid}`);
  //       const queryMessages = query(chatsRef, limitToLast(take));

  //       const unsubscribeOnDelete = onValue(ref(realtimeDB, `chats/${friendshipData?.chatuuid}`), (snapshot) => {
  //         if (!snapshot.exists()) {
  //           if (router.canGoBack()) {
  //             router.back();  // closes the chat if it doesn't exist (when two users are no longer friends)
  //           }
  //         }
  //       });

  //       const unsubscribeOnChange = onValue(queryMessages, (snapshot) => {
  //         const newMessagesMap = new Map<string, UserMessagesData>([]);

  //         snapshot.forEach(data => {
  //           const newMessage = {
  //             ...data?.val(),
  //             messageUUID: data?.key ?? ''
  //           } as UserMessagesData;

  //           newMessagesMap.set(newMessage._id.toString(), newMessage);
  //         });

  //         setMessages(prev => new Map([
  //           ...prev.entries(),
  //           ...newMessagesMap.entries() // adds new messages to the end
  //         ]));
  //       });

  //       return () => {
  //         unsubscribeOnChange();
  //         unsubscribeOnDelete();
  //       };
  //     }
  //   }, [friendshipData?.chatuuid])
  // );


  return (
    <>
      <Stack.Screen
        options={{
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTitle: () => {
            return (
              <TouchableOpacity>
                <HStack $y='center' $x='center' gap={theme.spacing.sp1}>
                  <ImageWithPlaceholder
                    style={styles.avatarImg}
                    source={{ uri: targetUser?.photos[0]?.url }}
                    placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
                  />
                  <TextView style={styles.avatarName}>{targetUser?.name}</TextView>
                </HStack>
              </TouchableOpacity>
            );
          },
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        {/* <View style={styles.container}> */}
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSendMessage(messages)}
          showUserAvatar={true}
          user={{
            _id: currentUser?.id ?? '',
            name: currentUser?.username ?? '',
            avatar: currentUser?.photos[0]?.url ?? ''
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
                <Condition
                  if={message.user._id === currentUser?.id}
                  then={(
                    <>
                      <Entypo
                        name="check"
                        size={13.6}
                      // color={message.sent ? blue_100 : gray_50}
                      />
                      <Entypo
                        style={{ marginLeft: -6 }}
                        name="check"
                        size={13.6}
                      // color={message.received ? blue_100 : gray_50}
                      />
                    </>
                  )}
                />
              )}
              key={props.currentMessage?._id}
              textStyle={{
                // right: { color: text, fontFamily: 'Poppins' },
                // left: { color: text, fontFamily: 'Poppins' }
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
            if (!targetUser?.uid || !currentUser?.id) {
              return null;
            }
            const avatarProps = {
              ...props,
              currentMessage: {
                ...props.currentMessage,
                user: {
                  ...props.currentMessage?.user,
                  avatar: props.currentMessage?.user?._id === targetUser?.uid
                    ? targetUser?.photos[0]?.url
                    : currentUser?.photos[0]?.url
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
        {/* </View> */}
      </SafeAreaView>
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  avatarImg: {
    aspectRatio: 1,
    borderRadius: 99_999,
    height: 30
  },
  avatarName: {
    marginBottom: -2,
    textTransform: 'capitalize'
  }
}));
