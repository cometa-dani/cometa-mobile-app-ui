import { StyleSheet, SafeAreaView, TextInput, Pressable, Image, View as TransparentView } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { BaseButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { blue_100, gray_900, messages } from '../../../constants/colors';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useCometaStore } from '../../../store/cometaStore';
import { defaultImgPlaceholder } from '../../../constants/vars';
import { titles } from '../../../constants/assets';
import { markLastMessageAsSeen as writeLastMessageAsSeenIntoDB } from '../../../firebase/writeToRealTimeDB';
import { If } from '../../../components/utils';
import { UserMessagesData } from '../../../store/slices/messagesSlices';
import { useInfiniteQuerySearchFriendsByUserName } from '../../../queries/loggedInUser/friendshipHooks';
import { FontAwesome5 } from '@expo/vector-icons';


export default function ChatLatestMessagesScreen(): JSX.Element {
  const friendsMessagesList = useCometaStore(state => state.friendsMessagesList);
  const [showSearchedFriends, setShowSearchedFriends] = useState(false);
  const loggedInUserUUID = useCometaStore(state => state.uid);

  // search user by username
  const [textInput, setTextInput] = useState('');
  const inputRef = useRef<TextInput>(null);

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

  const memoizedSearchedFriendsData: UserMessagesData[] = useMemo(() => (
    searchedFriendsData?.pages
      ?.flatMap(
        page => page.friendships
          .map(
            friendship => ({
              chatUUID: friendship.chatuuid,
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
  }, [memoizedSearchedFriendsData, textInput]);


  const handleNavigateToChatWithFriendOrGroup = (receivedMessage: UserMessagesData) => {
    const { user, chatUUID, createdAt, text, isChatGroup } = receivedMessage;

    if (receivedMessage?.isChatGroup) {
      router.push(`/chatGroup/${chatUUID}`);
      markMessageAsSeenByLoggedInUserO();
    }
    else {
      router.push(`/chat/${user._id}`);
      markMessageAsSeenByLoggedInUserO();
    }

    // ************************************************
    // debug for chat groups
    // ************************************************
    function markMessageAsSeenByLoggedInUserO() {
      setTimeout(() => setTextInput(''), 200);
      if (receivedMessage?.newMessagesCount) {
        const messagePayload = { createdAt: createdAt?.toString(), text, user, isChatGroup };
        writeLastMessageAsSeenIntoDB(loggedInUserUUID, chatUUID, messagePayload);
      }
      else if (showSearchedFriends) {
        const messagePayload = {
          createdAt: createdAt?.toString(),
          text: friendsMessagesList.find(friend => friend.user._id === user._id)?.text, // change to O(1) using new Map instead
          user,
          isChatGroup
        };
        writeLastMessageAsSeenIntoDB(loggedInUserUUID, chatUUID, messagePayload);
      }
    }
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
              <TouchableOpacity onPress={() => router.push('/(app)/chatApp/(createChatGroup)/addFriendsScreen')} style={{ marginRight: 16 }}>
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
              ref={inputRef}
              style={styles.input}
              value={textInput}
              onChangeText={setTextInput}
              placeholder='type @ to search all your friends...'
            />
            <Pressable style={styles.pressable}>
              {({ pressed }) => (
                <FontAwesome style={{ opacity: pressed ? 0.5 : 1 }} size={18} color={'#fff'} name='search' />
              )}
            </Pressable>
          </View>
        </View>

        <FlashList
          data={showSearchedFriends ? memoizedSearchedFriendsData : friendsMessagesList}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <BaseButton
              onPress={() => handleNavigateToChatWithFriendOrGroup(item)}
              style={styles.baseButton}
            >
              <TransparentView style={styles.transparentView1}>

                <TransparentView style={styles.transparentView2}>
                  <If
                    condition={item?.isChatGroup && !item.user?.avatar}
                    render={(
                      <FontAwesome5 name="users" size={40} color={gray_900} />
                    )}
                    elseRender={(
                      <Image
                        source={{ uri: item.user?.avatar?.toString() ?? defaultImgPlaceholder }}
                        style={styles.image}
                      />
                    )}
                  />
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

                  <If
                    condition={!showSearchedFriends}
                    render={(
                      <TransparentView style={styles.transparentView4}>
                        <Text style={[styles.textGray, { color: item.newMessagesCount ? messages.ok : undefined }]}>
                          {new Date(item.createdAt?.toString()).toLocaleTimeString()}
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
                    )}
                    elseRender={(
                      <FontAwesome style={{ alignSelf: 'center', color: messages.ok }} name='send-o' size={23} />
                    )}
                  />
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
