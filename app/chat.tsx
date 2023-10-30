import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { View, useColors } from '../components/Themed';
import { Stack, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';


export default function ChatScreen(): JSX.Element {
  const { text } = useColors();
  const [messages, setMessages] = useState<IMessage[]>([]);


  const onSend = useCallback(async (messages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );

    // console.log(messages);
    const { _id, createdAt, text, user } = messages[0];
    const res = await addDoc(collection(db, 'chats'), { _id, createdAt, text, user });

    console.log(res);
  }, []);


  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://firebasestorage.googleapis.com/v0/b/cometa-e5dd5.appspot.com/o/users%2FBf3p1f2qsiXqieKhb4iAm11p0Tv1%2Favatar?alt=media&token=86e6d2f3-c57d-4610-accd-ccff2f93dc3d&_gl=1*1a7uhta*_ga*MTY4ODg0MTA0OS4xNjk3NTg2MTQ3*_ga_CW55HF8NVT*MTY5ODY0ODg2OC42MS4xLjE2OTg2NTAzMjguNDAuMC4w'
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: 'Hola Mundo',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 1,
  //         name: 'Cesar',
  //         avatar: 'https://firebasestorage.googleapis.com/v0/b/cometa-e5dd5.appspot.com/o/users%2F9ZODB2yQATTtXbgC7BJ5JppErV32%2Favatar?alt=media&token=13f14e47-3d4f-4786-b33c-8c3b68cc6352&_gl=1*yk4e7l*_ga*MTY4ODg0MTA0OS4xNjk3NTg2MTQ3*_ga_CW55HF8NVT*MTY5ODY0ODg2OC42MS4xLjE2OTg2NTAwMzYuMzYuMC4w'
  //       },
  //     },
  //   ]);
  // }, []);


  return (
    <>
      <StatusBar style={'auto'} />
      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerTitle: 'Chat Screen',
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerLeft: () => <FontAwesome name='arrow-down' size={24} onPress={() => router.back()} />
        }} />

      <View style={styles.container}>
        <GiftedChat
          renderBubble={(props) => (
            <Bubble
              {...props}
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
          optionTintColor='primary100'
          user={{
            _id: 1,
            name: 'Cesar',
            avatar: 'https://firebasestorage.googleapis.com/v0/b/cometa-e5dd5.appspot.com/o/users%2F9ZODB2yQATTtXbgC7BJ5JppErV32%2Favatar?alt=media&token=13f14e47-3d4f-4786-b33c-8c3b68cc6352&_gl=1*yk4e7l*_ga*MTY4ODg0MTA0OS4xNjk3NTg2MTQ3*_ga_CW55HF8NVT*MTY5ODY0ODg2OC42MS4xLjE2OTg2NTAwMzYuMzYuMC4w'
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
