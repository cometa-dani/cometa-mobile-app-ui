/* eslint-disable react/prop-types */
import { ReactNode, useCallback, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, Avatar, Message, InputToolbar } from 'react-native-gifted-chat';
import { FlatList, TouchableOpacity, View, RefreshControl, Platform, KeyboardAvoidingView, TextInput } from 'react-native';
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
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { TextView } from '@/components/text/text';
import { useCometaStore } from '@/store/cometaStore';
// import { UserMessagesData } from '@/store/slices/messagesSlices';
// import { useQueryGetFriendshipByTargetUserID } from '@/queries/currentUser/friendshipHooks';
import { Condition } from '@/components/utils/ifElse';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { HStack } from '@/components/utils/stacks';
import { useMessages } from '@/queries/chat/useMessages';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
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
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitle: () => {
            return (
              <HStack $x='center' $y='center' styles={{ gap: theme.spacing.sp1, flex: 1 }}>
                <ImageWithPlaceholder
                  style={styles.avatarImg}
                  source={{ uri: targetUser?.photos[0]?.url }}
                  placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
                />
                <TextView style={styles.avatarName}>{targetUser?.name}</TextView>
              </HStack>
            );
          },
        }}
      />
      <SafeAreaView edges={{ top: 'off', bottom: 'maximum' }} style={{ flex: 1, backgroundColor: theme.colors.white100 }}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSendMessage(messages)}
          showUserAvatar={true}
          user={{
            _id: currentUser?.id ?? '',
            name: currentUser?.username ?? '',
            avatar: currentUser?.photos[0]?.url ?? ''
          }}
          loadEarlier={true}
          isStatusBarTranslucentAndroid={true}
          isCustomViewBottom={true}
          listViewProps={{
            // contentContainerStyle: { flex: 1 },r
            // style: { flex: 1 },
            refreshControl: (
              <RefreshControl
                refreshing={isLoadingMore}
                onRefresh={handleRefreshControl}
              />
            )
          }}
          // messageContainerRef={isLoadingMore ? undefined : chatRef}
          alwaysShowSend={true}
          inverted={false}
          // renderFooter={() => (
          //   <View style={{ height: 30 }} />
          // )}
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
                        color={theme.colors.blue100}
                      />
                      <Entypo
                        style={{ marginLeft: -6 }}
                        name="check"
                        size={13.6}
                        color={theme.colors.blue100}
                      />
                    </>
                  )}
                />
              )}
              key={props.currentMessage?._id}
              textStyle={{
                right: { color: theme.colors.gray900, fontFamily: theme.text.fontRegular, fontSize: theme.text.size.s4 },
                left: { color: theme.colors.gray900, fontFamily: theme.text.fontRegular, fontSize: theme.text.size.s4 }
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: '#B7EEFF',
                  padding: 6,
                  borderRadius: 24,
                  marginRight: -10,
                  minWidth: '50%',
                  maxWidth: '85%',
                },
                left: {
                  backgroundColor: theme.colors.white100, padding: 6, borderRadius: 24, borderColor: theme.colors.gray100, borderWidth: 1.4
                }
              }}
            />
          )}
          renderInputToolbar={(_props) => (
            <InputToolbar
              // {...props}
              // onPressActionButton={() => {
              //   console.log('onPressActionButton');
              // }}
              renderSend={(props) => (
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    backgroundColor: theme.colors.red100,
                    // padding: 9,
                    borderRadius: 99_999,
                    width: 46,
                    height: 46,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                // onPress={() => console.log(props.sendButtonProps?.onPress)}
                >
                  <Feather name="send" size={22} color={theme.colors.white100} />
                </TouchableOpacity>
              )}
              renderComposer={(props) => (
                <TextInput
                  {...props}
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.slate75,
                    padding: 16,
                    borderRadius: 25,
                    height: 50,
                    marginRight: 16
                  }}
                  placeholder="Your message here..."
                />
              )}
              containerStyle={{
                marginLeft: 16,
                marginRight: 16,
                marginBottom: (Platform.OS === 'android' ? 60 : 0),
                borderColor: theme.colors.white100,
                borderWidth: 0,
                shadowColor: 'transparent',
                borderTopWidth: 0,
                display: 'flex',
                justifyContent: 'center',
                borderRadius: 25,
                overflow: 'hidden'
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
