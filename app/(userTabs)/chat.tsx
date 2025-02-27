import { TouchableOpacity, View, SafeAreaView } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Tabs, useRouter } from 'expo-router';
import { EmptyMessage } from '@/components/empty/Empty';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';
import { Condition } from '@/components/utils/ifElse';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { FlashList } from '@shopify/flash-list';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { Image } from 'expo-image';
import { Entypo } from '@expo/vector-icons';
import { TextView } from '@/components/text/text';
import { FC, ReactNode, useState } from 'react';
import { useLatestMessages } from '@/queries/chat/useLatestMessages';
import { IFriendship, ILastMessage } from '@/models/Friendship';
import { useCometaStore } from '@/store/cometaStore';
import { IGetTargetUser } from '@/models/User';
import { IMessage } from 'react-native-gifted-chat';
import { useInfiniteQuerySearchFriendsByUserName } from '@/queries/currentUser/friendshipHooks';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { Button } from '@/components/button/button';
import { imageTransition } from '@/constants/vars';


export default function ChatScreen() {
  const [debouncedTextInput, setDebouncedTextInput] = useDebouncedState('');
  const {
    data: searchedFriendsData,
    isFetched,
    isPending,
    hasNextPage,
    isFetching,
    fetchNextPage
  } = useInfiniteQuerySearchFriendsByUserName(debouncedTextInput);
  const searchFriends = searchedFriendsData?.pages.flatMap((page) => page.items) ?? [];
  const handleInfiniteScroll = () => !isFetching && hasNextPage && fetchNextPage();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <SystemBars style='dark' />
      <Tabs.Screen
        options={{
          headerSearchBarOptions: {
            onChangeText: (e) => {
              setDebouncedTextInput(e.nativeEvent.text);
            },
            autoFocus: false,
            placeholder: 'search',
            inputType: 'text',
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
          },
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Condition
          if={isFocused && debouncedTextInput}
          then={(
            <FriendsList
              friendships={searchFriends}
              isFetched={isFetched}
              isPending={isPending}
              onEndReached={handleInfiniteScroll}
            />
          )}
          else={
            <ChatList />
          }
        />
      </SafeAreaView>
    </>
  );
}


const ChatList: FC = () => {
  const { theme } = useStyles();
  const { data = [], isFetched, isPending } = useLatestMessages();
  return (
    <Condition
      if={isFetched && !isPending}
      then={
        <Condition
          if={!data?.length}
          then={(
            <Center styles={{ flex: 1, padding: 34, paddingTop: 0 }}>
              <EmptyMessage
                title='Oops! Looks like your chat list is empty'
                subtitle='Head back to the bucketlist and meet new friends!'
              />
            </Center>
          )}
          else={(
            <FlashList
              data={data}
              showsVerticalScrollIndicator={true}
              estimatedItemSize={112}
              contentContainerStyle={{ paddingBottom: theme.spacing.sp6, paddingTop: theme.spacing.sp4 }}
              ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
              onEndReachedThreshold={0.5}
              renderItem={renderChatItem}
            />
          )}
        />
      }
      else={(<SkeletonList />)}
    />
  );
};


const renderChatItem = ({ item }: { item: ILastMessage }) => {
  return (
    <ChatItem item={item} />
  );
};


interface IChatItemProps {
  item: ILastMessage,
}
const ChatItem: FC<IChatItemProps> = ({ item: { friend, id, lastMessage, messages } }) => {
  const { styles, theme } = useStyles(styleSheet);
  const router = useRouter();
  const setTargetUser = useCometaStore(state => state.setTargetUser);
  const currentUser = useCometaStore(state => state.userProfile);
  const newMessages = (
    messages
      ?.filter(exludeMessages(currentUser?.id))  // Filter out messages that belong to the target user
      .filter(isNewMessage)
      .length || 0
  );
  return (
    <Swipeable
      enabled={false}
      renderRightActions={
        (_a, _b, swipeable) => (
          null
          // <RectButton
          //   onPress={() => {
          //     swipeable?.close();
          //   }}
          //   style={styles.deleteButton}
          // >
          //   <FontAwesome
          //     name='trash-o'
          //     size={22}
          //     color={theme.colors.red100}
          //   />
          // </RectButton>
        )
      }
    >
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.white80,
          paddingHorizontal: theme.spacing.sp6,
          gap: theme.spacing.sp2,
          paddingVertical: theme.spacing.sp2,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.gray100
        }}
        onPress={() => {
          setTargetUser(friend as IGetTargetUser);
          router.push(`/(userStacks)/chat?friendshipId=${id}`);
        }}
      >
        <HStack gap={theme.spacing.sp4}>
          <Image
            source={{ uri: friend?.photos?.at(0)?.url || '' }}
            placeholder={{ thumbhash: friend?.photos?.at(0)?.placeholder || '' }}
            style={styles.img}
          />
          <VStack $y='center' styles={{ flex: 1 }}>
            <TextView
              numberOfLines={1}
              ellipsis={true}
              style={{
                fontSize: 14,
                fontFamily: theme.text.fontSemibold
              }}
            >
              {friend?.name}
            </TextView>
            <TextView
              numberOfLines={1}
              ellipsis={true}
              style={{
                fontSize: 13.6,
                color: theme.colors.gray400
              }}
            >
              {lastMessage?.text}
            </TextView>
          </VStack>

          <VStack $y='center' $x='center'>
            <TextView
              numberOfLines={1}
              ellipsis={true}
              style={{
                fontSize: 13.6,
                color: theme.colors.gray400
              }}
            >
              {format(lastMessage?.createdAt)}
            </TextView>
            <Condition
              if={newMessages}
              then={(
                <View style={{
                  backgroundColor: theme.colors.blue100,
                  borderRadius: 99_999,
                  width: 22,
                  height: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TextView
                    numberOfLines={1}
                    ellipsis={true}
                    style={{
                      fontSize: 13.6,
                      color: theme.colors.white100,
                      fontFamily: theme.text.fontSemibold
                    }}
                  >
                    {newMessages}
                  </TextView>
                </View>
              )}
              else={(
                <HStack>
                  <Entypo
                    name="check"
                    size={14}
                    color={lastMessage?.sent ? theme.colors.blue100 : theme.colors.gray200}
                  />
                  <Entypo
                    style={{ marginLeft: -6 }}
                    name="check"
                    size={14}
                    color={lastMessage?.received ? theme.colors.blue100 : theme.colors.gray200}
                  />
                </HStack>
              )}
            />
          </VStack>
        </HStack>
      </TouchableOpacity>
    </Swipeable>
  );
};


interface IFriendsListProps {
  friendships: IFriendship[],
  onEndReached: () => void,
  isPending: boolean,
  isFetched: boolean,
}

const FriendsList: FC<IFriendsListProps> = ({ friendships, isFetched, isPending, onEndReached }) => {
  const { theme } = useStyles();
  return (
    <Condition
      if={isFetched && !isPending}
      then={
        <Condition
          if={!friendships?.length}
          then={(
            <Center styles={{ flex: 1, padding: 34, paddingTop: 0 }}>
              <EmptyMessage
                title='Oops! Looks like your chat list is empty'
                subtitle='Head back to the bucketlist and meet new friends!'
              />
            </Center>
          )}
          else={(
            <FlashList
              data={friendships}
              showsVerticalScrollIndicator={true}
              estimatedItemSize={112}
              contentContainerStyle={{ paddingBottom: theme.spacing.sp6, paddingTop: theme.spacing.sp4 }}
              ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
              onEndReachedThreshold={0.5}
              onEndReached={onEndReached}
              renderItem={({ item }) => (
                <FriendItem friendship={item} />
              )}
            />
          )}
        />
      }
      else={(<SkeletonList />)}
    />
  );
};


interface IFrienItemProsp {
  friendship: IFriendship
}
const FriendItem: FC<IFrienItemProsp> = ({ friendship }) => {
  const { friend, id } = friendship;
  const { theme, styles } = useStyles(styleSheet);
  const setTargetUser = useCometaStore(state => state.setTargetUser);
  const router = useRouter();
  return (
    <HStack
      $y='center'
      gap={theme.spacing.sp4}
      styles={{
        paddingHorizontal: theme.spacing.sp6,
        paddingBottom: theme.spacing.sp6
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1, flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.sp4
        }}
      >
        <Image
          recyclingKey={friend?.uid}
          transition={imageTransition}
          source={{ uri: friend?.photos.at(0)?.url }}
          placeholder={{ thumbhash: friend?.photos.at(0)?.placeholder }}
          style={styles.imgAvatar}
        />
        <VStack
          $y='center'
          styles={{ flex: 1 }}
        >
          <TextView bold={true} ellipsis={true}>
            {friend?.name}
          </TextView>
          <TextView ellipsis={true}>
            {friend?.username}
          </TextView>
        </VStack>
      </TouchableOpacity>

      <Button
        style={{ padding: 6, borderRadius: theme.spacing.sp2, width: 100 }}
        onPress={() => {
          setTargetUser(friend as IGetTargetUser);
          router.push(`/(userStacks)/chat?friendshipId=${id}`);
        }}
        variant='gray-alt'>
        Chat
      </Button>
    </HStack>
  );
};

const isNewMessage = (message: IMessage) => message.sent && !message.received;


function exludeMessages(userId?: number) {
  return (message: IMessage) => message.user._id !== userId;
}


function format(date: number | Date | undefined): string {
  return (
    new Date(date || Date.now()).toLocaleTimeString(
      'en-US',
      { hour: 'numeric', minute: 'numeric' }
    )
  );
}


const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;

const SkeletonList: FC = () => {
  const { theme, styles } = useStyles(styleSheet);
  return (
    <FlashList
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
      estimatedItemSize={60}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      renderItem={() => (
        <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
          <HStack
            $y='center'
            gap={theme.spacing.sp4}
            styles={{ paddingHorizontal: theme.spacing.sp6 }}
          >
            <View style={[
              styles.imgAvatar,
              { backgroundColor: theme.colors.gray200 }
            ]} />
            <VStack
              $y='center'
              gap={theme.spacing.sp1}
              styles={{ flex: 1 }}
            >
              <View style={{
                backgroundColor: theme.colors.gray200,
                height: 16,
                width: '60%',
                flexDirection: 'row',
                borderRadius: 10
              }}
              />
              <View style={{
                backgroundColor: theme.colors.gray200,
                height: 16,
                width: '80%',
                flexDirection: 'row',
                borderRadius: 10
              }}
              />
            </VStack>
            <View style={{
              width: 94,
              backgroundColor: theme.colors.gray200,
              borderRadius: theme.spacing.sp2,
              height: 34,
            }} />
          </HStack>
        </MySkeleton>
      )}
    />
  );
};


const styleSheet = createStyleSheet((theme) => ({
  bubble: {
    aspectRatio: 1,
    borderRadius: 100,
    height: 30,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flex: 0,
    gap: -11,
    justifyContent: 'flex-start',
  },
  deleteButton: {
    backgroundColor: theme.colors.red50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginRight: theme.spacing.sp7,
    padding: 10,
  },
  img: {
    borderRadius: 99_999,
    height: 58,
    width: 58,
  },
  imgAvatar: {
    width: 60, height: 60, borderRadius: 99_999
  }
}));
