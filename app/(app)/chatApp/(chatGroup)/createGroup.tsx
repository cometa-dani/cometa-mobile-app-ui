import { StyleSheet, SafeAreaView, TextInput, Pressable, Image, View as TransparentView } from 'react-native';
import { Text, View } from '../../../../components/Themed';
import { BaseButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { blue_100, red_100 } from '../../../../constants/colors';
import { FlashList } from '@shopify/flash-list';
import { useCometaStore } from '../../../../store/cometaStore';
import { defaultImgPlaceholder } from '../../../../constants/vars';
import { If } from '../../../../components/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function CreateChatGroupScreen(): JSX.Element {
  const chatGroupMembers = useCometaStore(state => state.chatGroupMembers);

  // const [textInput, setTextInput] = useState('');
  // const inputRef = useRef<TextInput>(null);

  // listen for search input changes
  // useEffect(() => {
  //   const timeOutId = setTimeout(() => {
  //     setDebouncedTextInput(textInput);
  //     // if (textInput.length) {
  //     // }
  //   }, 1_400);

  //   return () => clearTimeout(timeOutId);
  // }, [textInput]);

  // const [debouncedTextInput, setDebouncedTextInput] = useState('');
  // const { data: searchedFriendsData, isSuccess } = useInfiniteQuerySearchFriendsByUserName(debouncedTextInput || '@');
  // const memoizedSearchedFriendsData: UserMessagesData[] = useMemo(() => (
  //   searchedFriendsData?.pages
  //     ?.flatMap(
  //       page => page.friendships
  //         .map(
  //           friendship => ({
  //             chatUUID: friendship.chatuuid,
  //             text: friendship.friend.username,
  //             newMessagesCount: 0,
  //             user: {
  //               _id: friendship.friend.uid,
  //               name: friendship.friend.name,
  //               avatar: friendship.friend.photos[0]?.url
  //             },
  //             createdAt: new Date()
  //           })
  //         )
  //     ) ?? []
  // ), [searchedFriendsData?.pages]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'New group',
          headerTitleAlign: 'center',
          headerRight() {
            return (
              <TouchableOpacity style={{ marginRight: 16 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: red_100 }}>Create</Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <View style={styles.relativeView}>

            <BaseButton
              style={{ backgroundColor: '#545454', borderRadius: 16, width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={50}
                color={blue_100}
              />
            </BaseButton>

            <TextInput style={{ flex: 1 }} placeholder='Nombre del grupo (optional)' />
          </View>
        </View>

        <FlashList
          data={chatGroupMembers}
          estimatedItemSize={100}
          renderItem={({ item }) => {
            const checked = chatGroupMembers.some(member => member.user._id === item.user._id);
            return (
              <BaseButton style={styles.baseButton}>
                <TransparentView style={styles.transparentView1}>

                  <TransparentView style={styles.transparentView2}>
                    <Image
                      source={{ uri: item.user?.avatar?.toString() ?? defaultImgPlaceholder }}
                      style={styles.image}
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
                      condition={!checked}
                      render={(
                        <FontAwesome5 style={[styles.checkbox, { marginRight: 8 }]} name="user" size={20} color="black" />
                      )}
                      elseRender={(
                        <FontAwesome5 style={styles.checkbox} name="user-check" size={20} color="black" />
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

  checkbox: {
    borderRadius: 5,
    zIndex: 10,
    position: 'absolute',
    right: 0,
    alignSelf: 'center'
  },

  safeArea: {
    flex: 1
  },
  mainView: {
    flex: 1
  },
  innerView: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  relativeView: {
    position: 'relative',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row'
  },
  // input: {
  //   backgroundColor: '#F4F4F4',
  //   borderRadius: 50,
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   paddingLeft: 56
  // },
  // pressable: {
  //   position: 'absolute',
  //   zIndex: 30,
  //   left: 20,
  //   backgroundColor: blue_100,
  //   borderRadius: 50,
  //   padding: 4.4
  // },
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
  // messagesCount: {
  //   backgroundColor: messages.ok,
  //   width: 22,
  //   height: 22,
  //   borderRadius: 50,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   alignSelf: 'center'
  // },
  // messagesCountText: {
  //   color: '#fff',
  //   fontWeight: '900',

  // },
  textBold: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textGray: {
    color: 'gray'
  },
  // transparentView4: {
  //   alignSelf: 'center',
  //   gap: 4,
  //   height: '100%'
  // }
});
