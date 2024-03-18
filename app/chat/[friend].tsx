/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
// import { collection, addDoc, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { realtimeDB } from '../../firebase/firebase';
import { SafeAreaView } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
// import { useQueryGetFriendshipByReceiverAndSender } from '../../queries/loggedInUser/friendshipHooks';
import { Unsubscribe } from 'firebase/auth';
import { useCometaStore } from '../../store/cometaStore';
import { onChildAdded, onValue, push, ref, set } from 'firebase/database';
import { useQueryGetFriendshipByTargetUserID } from '../../queries/loggedInUser/friendshipHooks';


export default function ChatScreen(): JSX.Element {
  const { text } = useColors();

  // users ids
  const targetUserID = +useLocalSearchParams()['friend']; // TODO: can be uuid
  const loggedInUserUuid = useCometaStore(state => state.uid);

  const { data: friendshipData } = useQueryGetFriendshipByTargetUserID(targetUserID);
  const sender = friendshipData?.sender;
  const receiver = friendshipData?.receiver;

  // users profiles
  const targetUser = sender?.id === targetUserID ? sender : receiver;
  const loggedInUser = sender?.id !== targetUserID ? sender : receiver;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isFisrtReadComplete, setIsFirstReadComplete] = useState(false);

  // const messageReceiver = targetUserID === friendshipData?.receiver.id ? friendshipData?.receiver : friendshipData?.sender;
  // const messageSender = targetUserID !== friendshipData?.receiver.id ? friendshipData?.receiver : friendshipData?.sender;
  const onSendMessage = useCallback(async (messages: IMessage[] = []) => {
    try {
      const senderMessage = messages[0];
      const messagePayload: IMessage = {
        ...senderMessage,
        user: {
          _id: loggedInUserUuid,
          // later remove the following lines
          name: loggedInUser?.username,
          avatar: loggedInUser?.photos[0]?.url,
        }
      };
      if (friendshipData?.chatuuid) {
        const { chatuuid } = friendshipData;
        const chatsRef = ref(realtimeDB, `chats/${chatuuid}`);
        const chatListRef = push(chatsRef);
        const latestMessageRef = ref(realtimeDB, `latestMessages/${targetUser?.uid}/${chatuuid}`);

        await Promise.all([
          set(chatListRef, messagePayload),
          set(latestMessageRef, messagePayload) // overwrite the latest message if present
        ]);
        // const messagesSubCollection = collection(firestoreDB, 'chats', `${friendshipData?.id}`, 'messages');
        // await addDoc(messagesSubCollection, messagePayload);
      }
    }
    catch {
      return null;
    }
  }, [friendshipData?.chatuuid]);


  // TODO:
  // We should merge user's photo and name into the message object in every iteration

  // first read
  useEffect(() => {
    if (friendshipData?.chatuuid) {
      const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}`);

      // fires everytime a new message is added
      // unsubscribe = onChildAdded(chatsRef, (data) => {
      // console.log(data.val());
      // setMessages((previousMessages) => GiftedChat.append(previousMessages, data.val()));
      // addCommentElement(postElement, data.key, data.val().text, data.val().author);
      // });

      // fires only once and retrieves all the messages at once
      onValue(chatsRef, (snapshot) => {
        const messagesList: IMessage[] = [];
        snapshot.forEach((childSnapshot) => {
          const messageData = childSnapshot.val() as IMessage;
          messagesList.push(messageData);
        });

        setMessages(messagesList); // snapshot.val();
        setIsFirstReadComplete(true);
      }, {
        onlyOnce: true
      });


      // const queryCollRef = query(
      //   collection(firestoreDB, 'chats', `${friendshipData?.id}`, 'messages'),
      //   orderBy('createdAt', 'desc'),
      //   limit(10),
      // );
      // // TODO: just listen for the last message only
      // unsubscribe = onSnapshot(queryCollRef, (querySnapshot) => {
      //   const myMessage: IMessage[] = [];
      //   querySnapshot.forEach((doc) => {
      //     const data = doc.data();
      //     const createdAt = new Date(data['createdAt']['seconds'] * 1000);
      //     const message = { ...data, createdAt } as IMessage;
      //     myMessage.push({ ...message });
      //   });

      //   setMessages(myMessage);
      // });
    }
  }, [friendshipData?.chatuuid]);


  // listen for new added messages
  useEffect(() => {
    let unsubscribe!: Unsubscribe;
    if (friendshipData?.chatuuid && isFisrtReadComplete) {
      const chatsRef = ref(realtimeDB, `chats/${friendshipData?.chatuuid}`);

      unsubscribe = onChildAdded(chatsRef, (data) => {
        const newMessage = data.val() as IMessage;
        const addLatestMessage = (messages: IMessage[]) => {
          const foundMessage = messages.find((message) => message._id === newMessage._id);
          if (!foundMessage) {
            return messages.concat(newMessage);
          }
          return messages;
        };
        setMessages(addLatestMessage);
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [friendshipData?.chatuuid, isFisrtReadComplete]);


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
              key={props.currentMessage?._id}
              textStyle={{
                right: { color: text },
                left: { color: text }
              }}
              wrapperStyle={{
                right: { backgroundColor: '#ead4fa', padding: 8, borderRadius: 24 },
                left: { backgroundColor: '#f0f0f0', padding: 8, borderRadius: 24 }
              }}
            />
          )}
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
    paddingTop: 20,
    flex: 1,
  }
});
