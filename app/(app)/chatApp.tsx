import { StyleSheet, SafeAreaView, TextInput, Pressable, Image, View as TransparentView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { BaseButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { blue_100 } from '../../constants/colors';
import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';


const chatData = [
  {
    id: 1,
    name: 'John',
    message: 'Dude!',
    time: '10:00 AM',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
  },
  {
    id: 2,
    name: 'Ramon',
    message: 'Will you be there?',
    time: '10:00 AM',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
  {
    id: 3,
    name: 'Marco Vizanti',
    message: 'hi',
    time: '10:00 AM',
    avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
  },
  {
    id: 4,
    name: 'Maria Smith',
    message: 'Hello, how are you?',
    time: '10:00 AM',
    avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
  },
  {
    id: 5,
    name: 'Karlota Jaramillo',
    message: 'Hi',
    time: '10:00 AM',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 7,
    name: 'Emma Brown',
    message: 'I missed you',
    time: '10:00 AM',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 8,
    name: 'Jackie Chan',
    message: 'Hey mate',
    time: '10:00 AM',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  }
];


export default function ChatAppScreen(): JSX.Element {
  const [textInput, setTextInput] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Chat',
          headerTitleAlign: 'center',
          headerRight() {
            return (
              <TouchableOpacity style={{ marginRight: 24 }}>
                <FontAwesome size={30} color={blue_100} name='plus-circle' />
              </TouchableOpacity>
            );
          },
        }}
      />
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <View style={styles.relativeView}>
            <TextInput
              style={styles.input}
              value={textInput}
              onChangeText={setTextInput}
              placeholder='buscar...'
            />
            <Pressable style={styles.pressable}>
              {({ pressed }) => (
                <FontAwesome style={{ opacity: pressed ? 0.5 : 1 }} size={18} color={'#fff'} name='search' />
              )}
            </Pressable>
          </View>
        </View>

        <FlashList
          data={chatData}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <BaseButton
              // onPress={() => router.push(`/chat/${item.id}`)}
              style={styles.baseButton}
            >
              <TransparentView style={styles.transparentView1}>

                <TransparentView style={styles.transparentView2}>
                  <Image source={{ uri: item.avatar }} style={styles.image} />
                </TransparentView>

                <TransparentView style={styles.transparentView3}>
                  <TransparentView>
                    <Text style={styles.textBold}>{item.name}</Text>
                    <Text style={styles.textGray}>{item.message}</Text>
                  </TransparentView>

                  <TransparentView style={styles.transparentView4}>
                    <Text style={styles.textGray}>{item.time}</Text>
                  </TransparentView>
                </TransparentView>
              </TransparentView>
            </BaseButton>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  mainView: {
    flex: 1
  },
  innerView: {
    padding: 20,
    paddingVertical: 10
  },
  relativeView: {
    position: 'relative',
    justifyContent: 'center'
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingLeft: 56
  },
  pressable: {
    position: 'absolute',
    zIndex: 30,
    left: 20,
    backgroundColor: blue_100,
    borderRadius: 50,
    padding: 4.4
  },
  baseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24
  },
  transparentView1: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    flex: 1
  },
  transparentView2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden'
  },
  image: {
    width: 60,
    height: 60
  },
  transparentView3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1
  },
  textBold: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  textGray: {
    color: 'gray'
  },
  transparentView4: {
    alignSelf: 'center'
  }
});
