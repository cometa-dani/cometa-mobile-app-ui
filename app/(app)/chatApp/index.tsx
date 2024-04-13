/* eslint-disable react-native/no-raw-text */
import { StyleSheet, SafeAreaView, TextInput, Pressable, Image, View as TransparentView, Text as TransparentText } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { BaseButton, RectButton, Swipeable } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { gray_50, gray_900, messages, red_100, white_50 } from '../../../constants/colors';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useCometaStore } from '../../../store/cometaStore';
import { defaultImgPlaceholder } from '../../../constants/vars';
import { titles } from '../../../constants/assets';
import chatWithFriendService from '../../../services/chatWithFriendService';
import { If } from '../../../components/utils';
import { UserMessagesData } from '../../../store/slices/messagesSlices';
import { useInfiniteQuerySearchFriendsByUserName } from '../../../queries/loggedInUser/friendshipHooks';
import { FontAwesome5 } from '@expo/vector-icons';
import ReactNativeModal from 'react-native-modal';
import { appButtonstyles } from '../../../components/buttons/buttons';
import Checkbox from 'expo-checkbox';


export default function ChatLatestMessagesScreen(): JSX.Element {
  const friendsLatestMessagesList = useCometaStore(state => state.friendsLatestMessagesList);
  const [showSearchedFriends, setShowSearchedFriends] = useState(false);
  const loggedInUserUUID: string = useCometaStore(state => state.uid);

  // search user by username
  const [textInput, setTextInput] = useState('');
  const inputRef = useRef<TextInput>(null);

  // modal
  const [toggleModal, setToggleModal] = useState(false);
  const [deleteMedia, setDeleteMedia] = useState(true);
  const chatuuidToDelete = useRef('');


  // listen for search input changes
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (textInput.length) {
        setDebouncedTextInput(textInput);
      }
    }, 1_400);

    return () => clearTimeout(timeOutId);
  }, [textInput]);


  const [debouncedTextInput, setDebouncedTextInput] = useState('');
  const { data: searchedFriendsData, isSuccess } = useInfiniteQuerySearchFriendsByUserName(debouncedTextInput);


  const memoizedSearchedFriendsList: UserMessagesData[] = useMemo(() => (
    searchedFriendsData?.pages
      ?.flatMap(
        page => page.friendships
          .map(
            friendship => ({
              chatUUID: friendship?.chatuuid,
              text: friendship.friend.username,
              newMessagesCount: 0,
              isChatGroup: false,
              user: {
                _id: friendship.friend.uid,
                name: friendship.friend.name,
                avatar: friendship.friend.photos[0]?.url
              },
              createdAt: new Date()
            })
          )
      ) ?? []
  ), [searchedFriendsData?.pages]);


  useEffect(() => {
    if (isSuccess && textInput.length) {
      setShowSearchedFriends(true);
    }
    else {
      setShowSearchedFriends(false);
    }
  }, [memoizedSearchedFriendsList, textInput]);


  const navigateToChatWithFriend = async (receivedMessage: UserMessagesData) => {
    let messagePayload!: UserMessagesData;
    const { user } = receivedMessage;
    router.push(`/chat/${user._id}`);

    if (showSearchedFriends) {
      const currentFriendMessage = friendsLatestMessagesList.find(friend => friend.user._id === user._id);
      if (!currentFriendMessage) {
        return;
      }
      messagePayload = currentFriendMessage;
    }
    else {
      messagePayload = receivedMessage;
    }
    if (!messagePayload.newMessagesCount) return;

    chatWithFriendService.markLastMessageAsSeen(loggedInUserUUID, messagePayload);
  };


  const navigateToChatWithGroup = async (receivedMessage: UserMessagesData) => {
    const { chatUUID } = receivedMessage;
    router.push(`/chatGroups/${chatUUID}/messages`);
    // const currentFriend = friendsLatestMessagesList.find(friend => friend.user._id === user._id);
    // const messagePayload = { ...receivedMessage, user: { ...receivedMessage.user, text: currentFriend?.text ?? '' } };

    // chatWithFriendService.markLastMessageAsSeen(loggedInUserUUID, messagePayload);
  };


  const handlePressOnUserLatestMessage = (receivedMessage: UserMessagesData) => {
    if (receivedMessage?.isChatGroup) {
      navigateToChatWithGroup(receivedMessage);
    }
    else {
      navigateToChatWithFriend(receivedMessage);
    }
    setTimeout(() => setTextInput(''), 200);
  };


  const handleDeleteMessage = async () => {
    if (chatuuidToDelete.current && deleteMedia) {
      // delete media from the device gallery
    }
    else if (chatuuidToDelete.current && !deleteMedia) {
      await chatWithFriendService.deleteLatestMessage(loggedInUserUUID, chatuuidToDelete.current);
    }
    setToggleModal(false);
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
          // headerRight() {
          //   return (
          //     <TouchableOpacity onPress={() => router.push('/(app)/chatApp/(createChatGroup)/addFriendsScreen')} style={{ marginRight: 16 }}>
          //       <FontAwesome size={30}  color="#83C9DD" name='plus-circle' />
          //     </TouchableOpacity>
          //   );
          // },
        }}
      />

      <ReactNativeModal isVisible={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={{ gap: 20 }}>
            <View>
              <Text style={styles.modalTitle}>Delete this chat?</Text>
            </View>

            <View style={styles.modalCheckboxContainer}>
              <Checkbox
                onValueChange={(val) => setDeleteMedia(val)}
                value={deleteMedia}
                color={gray_900}
                style={{ borderRadius: 5 }}
              />
              <Text onPress={() => setDeleteMedia(prev => !prev)} style={{ width: '70%' }}>Also delete media received in this chat from the device gallery?</Text>
            </View>

            <View style={styles.modalButtonsContainer}>
              <Pressable
                style={{ ...appButtonstyles.button, backgroundColor: gray_900 }}
                onPress={() => setToggleModal(false)}>
                <TransparentText style={{ ...appButtonstyles.buttonText, color: white_50 }}>
                  Close
                </TransparentText>
              </Pressable>

              <Pressable
                style={{ ...appButtonstyles.button, backgroundColor: gray_900 }}
                onPress={handleDeleteMessage} >
                <TransparentText style={{ ...appButtonstyles.buttonText, color: white_50 }}>
                  Delete chat
                </TransparentText>
              </Pressable>
            </View>
          </View>
        </View>
      </ReactNativeModal>

      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <View style={styles.relativeView}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={textInput}
              onChangeText={setTextInput}
              placeholder='type @ to search all your friends...'
            />
            <Pressable style={styles.pressable}>
              {({ pressed }) => (
                <Ionicons
                  name="search-circle"
                  size={34}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                  color="#83C9DD"
                />
              )}
            </Pressable>
          </View>
        </View>

        <FlashList
          data={showSearchedFriends ? memoizedSearchedFriendsList : friendsLatestMessagesList}
          estimatedItemSize={100}
          renderItem={({ item: message }) => (
            <Swipeable
              renderRightActions={(_a, _b, swipeable) => (
                <RectButton
                  onPress={() => {
                    swipeable?.close();
                    // chatuuidToDelete.current = message.chatUUID;
                    setTimeout(() => setToggleModal(true), 100);
                  }}
                  style={styles.deleteButton}
                >
                  <FontAwesome name='trash-o' size={32} color={red_100} />
                </RectButton>
              )}>
              <BaseButton
                onPress={() => handlePressOnUserLatestMessage(message)}
                style={styles.baseButton}
              >
                <TransparentView style={styles.transparentView1}>

                  <TransparentView style={styles.transparentView2}>
                    <If
                      condition={message?.isChatGroup && !message.user?.avatar}
                      render={(
                        <FontAwesome5 name="users" size={40} color={gray_900} />
                      )}
                      elseRender={(
                        <Image
                          source={{ uri: message.user?.avatar?.toString() ?? defaultImgPlaceholder }}
                          style={styles.image}
                        />
                      )}
                    />
                  </TransparentView>

                  <TransparentView style={styles.transparentView3}>
                    <TransparentView style={{ flex: 2 / 3 }}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={styles.textBold}
                      >
                        {message.user.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={styles.textGray}
                      >
                        {message.text}
                      </Text>
                    </TransparentView>

                    <If
                      condition={!showSearchedFriends}
                      render={(
                        <TransparentView style={styles.transparentView4}>
                          <Text style={[styles.textGray, { color: message.newMessagesCount ? messages.ok : undefined }]}>
                            {new Date(message.createdAt?.toString()).toLocaleTimeString()}
                          </Text>
                          <If condition={message?.newMessagesCount}
                            render={(
                              <TransparentView style={styles.messagesCount}>
                                <Text style={styles.messagesCountText}>
                                  {message.newMessagesCount}
                                </Text>
                              </TransparentView>
                            )}
                          />
                        </TransparentView>
                      )}
                      elseRender={(
                        <FontAwesome style={{ alignSelf: 'center', color: messages.ok }} name='send-o' size={23} />
                      )}
                    />
                  </TransparentView>
                </TransparentView>
              </BaseButton>
            </Swipeable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 200,
    width: 300,
    padding: 24,
    borderRadius: 20,
    alignSelf: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    justifyContent: 'center',
    width: '100%'
  },
  modalButtonsContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%'
  },
  safeArea: {
    flex: 1
  },
  mainView: {
    flex: 1
  },
  innerView: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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

  deleteButton: {
    backgroundColor: gray_50,
    borderRadius: 20,
    justifyContent: 'center',
    marginRight: 20,
    padding: 24
  },

  pressable: {
    position: 'absolute',
    zIndex: 30,
    left: 10,
    borderRadius: 50,
    padding: 4.4
  },
  baseButton: {
    backgroundColor: white_50,
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
