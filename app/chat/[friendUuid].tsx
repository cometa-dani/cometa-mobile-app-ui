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
// import { MMKV, useMMKVListener } from 'react-native-mmkv';

// const mmkvStorage = new MMKV();


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
  const [messages, setMessages] = useState<IMessage[]>([]);
  const chatRef = useRef<FlatList<IMessage>>(null);


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


  // listen for new added messages
  useEffect(() => {
    let unsubscribe!: Unsubscribe;
    if (friendshipData?.chatuuid) {
      const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}`);
      const queryMessages = query(chatsRef, limitToLast(1));

      unsubscribe = onChildAdded(queryMessages, (data) => {
        const newMessage = data?.val() as IMessage;
        // setMessages(prev => prev.concat(newMessage));

        // store messages in mmkv
      });
    }
    return () => {
      // messages && setMessages([]);
      unsubscribe && unsubscribe();
    };
  }, [friendshipData?.chatuuid]);


  // useEffect(() => {
  //   if (friendshipData?.chatuuid) {
  //     mmkvStorage.addOnValueChangedListener((key: string) => {
  //       if (key === friendshipData?.chatuuid) {
  //         console.log('chatuuid changed');
  //       }
  //     });
  //   }
  // }, [friendshipData?.chatuuid]);

  // useMMKVListener((key: string) => {
  //   if (key === friendshipData?.chatuuid) {
  //     console.log('chatuuid changed');
  //   }
  // });

  // useEffect(() => {
  //   if (friendshipData?.chatuuid) {
  //     mmkvStorage.set(friendshipData?.chatuuid, JSON.stringify(messages));
  //   }
  // }, [friendshipData?.chatuuid]);


  useEffect(() => {
    setTimeout(() => {
      chatRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);


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
                    <Text>online</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          },
        }} />

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
                right: { color: text },
                left: { color: text }
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
