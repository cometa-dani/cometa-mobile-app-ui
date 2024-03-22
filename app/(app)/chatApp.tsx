import { StyleSheet, SafeAreaView, TextInput, Pressable, Image, View as TransparentView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { BaseButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { blue_100, messages } from '../../constants/colors';
import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useCometaStore } from '../../store/cometaStore';
import { defaultImgPlaceholder } from '../../constants/vars';
import { titles } from '../../constants/assets';
import { markLastMessageAsSeen } from '../../firebase/writeToRealTimeDB';
import { If } from '../../components/utils';
import { UserMessagesData } from '../../store/slices/messagesSlices';


export default function ChatAppScreen(): JSX.Element {
  const [textInput, setTextInput] = useState('');
  const friendsMessagesList = useCometaStore(state => state.friendsMessagesList);


  const handleNavigateToChatWithFriend = (targetUser: UserMessagesData) => {
    const { user, chatUUID, createdAt, text } = targetUser;
    const messagePayload = { createdAt, text, user };
    router.push(`/chat/${user._id}`);
    if (targetUser?.newMessagesCount === 0) return;

    markLastMessageAsSeen(user._id, chatUUID, messagePayload);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image style={{ height: 24, width: 76 }} source={titles.chat} />
          ),
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
          data={friendsMessagesList}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <BaseButton
              onPress={() => handleNavigateToChatWithFriend(item)}
              style={styles.baseButton}
            >
              <TransparentView style={styles.transparentView1}>

                <TransparentView style={styles.transparentView2}>
                  <Image source={{ uri: item.user?.avatar?.toString() ?? defaultImgPlaceholder }} style={styles.image} />
                </TransparentView>

                <TransparentView style={styles.transparentView3}>
                  <TransparentView>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode='tail'
                      style={styles.textBold}
                    >
                      {item.user.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode='tail'
                      style={styles.textGray}
                    >
                      {item.text}
                    </Text>
                  </TransparentView>

                  <TransparentView style={styles.transparentView4}>
                    <Text style={[styles.textGray, { color: item.newMessagesCount ? messages.ok : undefined }]}>
                      {new Date(item.createdAt.toString() ?? '').toLocaleTimeString()}
                    </Text>

                    <If condition={item?.newMessagesCount}
                      render={(
                        <TransparentView style={styles.messagesCount}>
                          <Text style={styles.messagesCountText}>
                            {item.newMessagesCount}
                          </Text>
                        </TransparentView>
                      )}
                    />
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
    flex: 1,
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
    flexGrow: 1,
    position: 'relative',
    height: '100%',
    gap: 14
  },
  messagesCount: {
    backgroundColor: messages.ok,
    width: 22,
    height: 22,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  messagesCountText: {
    color: '#fff',
    fontWeight: '900',

  },
  textBold: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textGray: {
    color: 'gray'
  },
  transparentView4: {
    alignSelf: 'center',
    gap: 4,
    height: '100%'
  }
});
