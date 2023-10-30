import { useCallback, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Stack, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';


export default function ChatScreen(): JSX.Element {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);


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
      {/* </Pressable> */}

      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages as never)}
          user={{
            _id: 1,
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    // justifyContent: 'center',
  },

  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   textAlign: 'center'
  // },
});
