import { StyleSheet, SafeAreaView, TextInput, Pressable, Image, View as TransparentView } from 'react-native';
import { Text, View } from '../../../../legacy_components/Themed';
import { BaseButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { blue_100, gray_900, red_100 } from '../../../../constants/colors';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useCometaStore } from '../../../../store/cometaStore';
import { defaultImgPlaceholder } from '../../../../constants/vars';
import { UserMessagesData } from '../../../../store/slices/messagesSlices';
import { useInfiniteQuerySearchFriendsByUserName } from '../../../../queries/currentUser/friendshipHooks';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { If } from '../../../../legacy_components/utils';


export function AddFriendsScreen(): JSX.Element {
  const chatGroupMembers = useCometaStore(state => state.chatGroupMembers);
  const setChatGroupMembers = useCometaStore(state => state.setChatGroupMembers);
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

  // search for friends
  const [debouncedTextInput, setDebouncedTextInput] = useState('');
  const { data: searchedFriendsData } = useInfiniteQuerySearchFriendsByUserName(debouncedTextInput || '@');
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
            }) as UserMessagesData
          )
      ) ?? []
  ), [searchedFriendsData?.pages, chatGroupMembers.size]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Add friends',
          headerTitleAlign: 'center',
          headerRight() {
            return (
              <TouchableOpacity onPress={() => router.push('/(app)/chatApp/(createChatGroup)/createGroup')} style={{ marginRight: 16 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: red_100 }}>Next</Text>
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
          data={memoizedSearchedFriendsData}
          estimatedItemSize={100}
          renderItem={({ item }) => {
            const checked: boolean = chatGroupMembers.has(item.user._id);
            return (
              <BaseButton
                onPress={() => setChatGroupMembers(item)}
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

                    <If
                      condition={!checked}
                      render={(
                        <FontAwesome5 style={[styles.checkbox, { marginRight: 8 }]} name="user" size={20} color={gray_900} />
                      )}
                      elseRender={(
                        <FontAwesome5 style={styles.checkbox} name="user-check" size={20} color={gray_900} />
                      )}
                    />

                  </TransparentView>
                </TransparentView>
              </BaseButton>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  baseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20
  },

  checkbox: {
    alignSelf: 'center',
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    zIndex: 10
  },
  image: {
    height: 60,
    width: 60
  },
  innerView: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingLeft: 56,
    paddingVertical: 10
  },
  mainView: {
    flex: 1
  },
  pressable: {
    backgroundColor: blue_100,
    borderRadius: 50,
    left: 20,
    padding: 4.4,
    position: 'absolute',
    zIndex: 30
  },
  relativeView: {
    justifyContent: 'center',
    position: 'relative'
  },
  safeArea: {
    flex: 1
  },
  textBold: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textGray: {
    color: 'gray'
  },
  transparentView1: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 20,
  },
  transparentView2: {
    borderRadius: 30,
    height: 60,
    overflow: 'hidden',
    width: 60
  },
  transparentView3: {
    flexDirection: 'row',
    flexGrow: 1,
    gap: 14,
    height: '100%',
    justifyContent: 'space-between',
    position: 'relative'
  }
});
