/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { collection, addDoc, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { SafeAreaView } from 'react-native';
import { Image as ImageWithPlaceholder } from 'expo-image';
import { useQueryGetFriendshipByReceiverAndSender } from '../../queries/loggedInUser/friendshipHooks';
import { Unsubscribe } from 'firebase/auth';


export default function ChatScreen(): JSX.Element {
  const { text } = useColors();

  // chat
  const friendID: number = +useLocalSearchParams()['friend'];
  const { data: friendshipData } = useQueryGetFriendshipByReceiverAndSender(friendID);
  const messageReceiver = friendID === friendshipData?.receiver.id ? friendshipData?.receiver : friendshipData?.sender;
  const messageSender = friendID !== friendshipData?.receiver.id ? friendshipData?.receiver : friendshipData?.sender;
  const [messages, setMessages] = useState<IMessage[]>([]);


  const onSend = useCallback(async (messages: IMessage[] = []) => {
    try {
      const senderMessage = messages[0];
      const messagePayload: IMessage = {
        ...senderMessage,
        user: {
          ...senderMessage.user,
          _id: messageSender?.id as number,
        }
      };
      if (friendshipData?.id) {
        const subCollection = collection(db, 'chats', `${friendshipData?.id}`, 'messages');
        await addDoc(subCollection, messagePayload);
      }
      else {
        throw new Error('frienship id undefined');
      }
    }
    catch (error) {
      // console.log(error);
    }
  }, [friendshipData?.id]);


  useEffect(() => {
    let unsubscribe!: Unsubscribe;
    if (friendshipData?.id) {
      const queryCollRef = query(
        collection(db, 'chats', `${friendshipData?.id}`, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(10),
      );

      // TODO: just listen for the last message only
      unsubscribe = onSnapshot(queryCollRef, (querySnapshot) => {
        const myMessage: IMessage[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = new Date(data['createdAt']['seconds'] * 1000);
          const message = { ...data, createdAt } as IMessage;
          myMessage.push({ ...message });
        });

        setMessages(myMessage);
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [friendshipData?.id]);


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
                source={{ uri: messageReceiver?.photos[0]?.url }}
                placeholder={{ thumbhash: messageReceiver?.photos[0]?.placeholder }}
              />

              <View>
                <Text style={styles.avatarName}>{messageReceiver?.username}</Text>
                <Text>online</Text>
              </View>
            </View>
          )
        }} />

      <View style={styles.container}>
        <GiftedChat
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
          isTyping={true}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          showUserAvatar={true}
          user={{
            _id: messageSender?.id as number,
            name: messageSender?.username,
            avatar: messageSender?.photos[0]?.url
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
    flex: 1,
  }
});
