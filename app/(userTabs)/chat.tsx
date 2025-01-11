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
import { RectButton } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { TextView } from '@/components/text/text';
import { FC, ReactNode } from 'react';
import { useLatestMessages } from '@/queries/chat/useLatestMessages';
import { ILastMessage } from '@/models/Friendship';
import { useCometaStore } from '@/store/cometaStore';
import { IGetTargetUser } from '@/models/User';


export default function ChatScreen() {
  return (
    <>
      <SystemBars style='dark' />
      <Tabs.Screen
        options={{
          headerSearchBarOptions: {
            autoFocus: false,
            placeholder: 'search',
            inputType: 'text',
            onFocus: () => { },
            onBlur: () => { },
          },
        }}
      />
      <ChatList />
    </>
  );
}


const ChatList: FC = () => {
  const { theme } = useStyles();
  const { data = [], isFetched, isPending } = useLatestMessages();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Condition
        if={isFetched && !isPending}
        then={
          <Condition
            if={!data?.length}
            then={(
              <Center styles={{ flex: 1, padding: 34, paddingTop: 0 }}>
                <EmptyMessage
                  title='Oops! Looks like your bucket list is empty'
                  subtitle='Head back to the homepage and add some exciting events!'
                />
              </Center>
            )}
            else={(
              <FlashList
                data={data}
                showsVerticalScrollIndicator={true}
                estimatedItemSize={112}
                contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
                ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
                onEndReachedThreshold={0.5}
                renderItem={renderBucketItem}
              />
            )}
          />
        }
        else={(<SkeletonList />)}
      />
    </SafeAreaView>
  );
};


const renderBucketItem = ({ item }: { item: ILastMessage }) => {
  return (
    <BucketItem item={item} />
  );
};


interface BucketItemProps {
  item: ILastMessage,
}
const BucketItem: FC<BucketItemProps> = ({ item: { friend, id, lastMessage } }) => {
  const { styles, theme } = useStyles(styleSheet);
  const router = useRouter();
  const setTargetUser = useCometaStore(state => state.setTargetUser);
  return (
    <Swipeable
      renderRightActions={
        (_a, _b, swipeable) => (
          <RectButton
            onPress={() => {
              swipeable?.close();
              // onDeleteEventLike(item.event.id);
            }}
            style={styles.deleteButton}
          >
            <FontAwesome
              name='trash-o'
              size={22}
              color={theme.colors.red100}
            />
          </RectButton>
        )
      }
    >
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.white80,
          paddingHorizontal: theme.spacing.sp6,
          gap: theme.spacing.sp2
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
          <VStack $y='center' gap={theme.spacing.sp1} styles={{ flex: 1 }}>
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
              {friend?.username}
            </TextView>
            <TextView
              numberOfLines={1}
              ellipsis={true}
              style={{ fontSize: 13.6 }}
            >
              {lastMessage?.text}
            </TextView>
          </VStack>
        </HStack>

      </TouchableOpacity>
    </Swipeable>
  );
};

const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


const SkeletonList: FC = () => {
  const { theme, styles } = useStyles(styleSheet);
  return (
    <FlashList
      data={[1, 2, 3, 4, 5, 6]}
      estimatedItemSize={112}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
      ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
      renderItem={() => (
        <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
          <TouchableOpacity
            style={{
              paddingHorizontal: theme.spacing.sp6,
              gap: theme.spacing.sp2
            }}
          >
            <HStack gap={theme.spacing.sp4}>
              <View
                style={[styles.img, { backgroundColor: theme.colors.gray200 }]}
              />
              <VStack $y='center' gap={theme.spacing.sp2} styles={{ flex: 1 }}>
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '60%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '100%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
                <View style={{
                  backgroundColor: theme.colors.gray200,
                  height: 16,
                  width: '100%',
                  flexDirection: 'row',
                  borderRadius: 10
                }} />
              </VStack>
            </HStack>
          </TouchableOpacity>
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
  }
}));
