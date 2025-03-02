import { FC, ReactNode, useCallback } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Stack, router } from 'expo-router';
import { RectButton, } from 'react-native-gesture-handler';
import { useInfiniteQuerySearchUsers } from '../../queries/search/useInfiniteQuerySearchUsers';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { defaultImgPlaceholder } from '../../constants/vars';
import { IGetBasicUserProfile, IGetTargetUser } from '../../models/User';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { AvatarSkeletonList } from '@/components/skeleton/avatarSkeleton';
import { useCometaStore } from '@/store/cometaStore';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { VStack } from '@/components/utils/stacks';


export default function SearchScreen(): ReactNode {
  const { theme } = useStyles(styleSheet);
  const setSelectedTargetUser = useCometaStore(state => state.setTargetUser);
  const [searchUsers, setSearchUsers] = useDebouncedState('');
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuerySearchUsers(searchUsers || '@');
  const usersData = data?.pages.flatMap(page => page.items) || [];

  const handleUserInfiniteScroll = () => {
    if (!isLoading && hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = useCallback(({ item }: IUserItem) => {
    return (
      <UserItem
        key={item.id}
        user={item}
        onPress={() => {
          setSelectedTargetUser(item as IGetTargetUser);
          router.replace('/(userStacks)/targetUser');
        }}
      />
    );
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Search',
          headerTitleAlign: 'center',
          headerSearchBarOptions: {
            onChangeText: (e) => {
              setSearchUsers(e.nativeEvent.text || '@');
            },
            autoFocus: true,
            placeholder: 'search',
            inputType: 'text',
          },
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, height: '100%' }}>
          <Condition
            if={isLoading}
            then={(<AvatarSkeletonList items={11} />)}
            else={(
              <FlashList
                contentInset={{ bottom: tabBarHeight * 2 }}
                contentContainerStyle={{ paddingTop: theme.spacing.sp4 }}
                onEndReached={handleUserInfiniteScroll}
                onEndReachedThreshold={0.5}
                estimatedItemSize={60}
                data={usersData}
                keyExtractor={item => item.id.toString()}
                ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
                renderItem={renderItem}
              />
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
}


interface IUserItem {
  item: Omit<IGetBasicUserProfile, 'outgoingFriendships' | 'incomingFriendships'>
}

interface UserItem {
  user: IGetBasicUserProfile,
  onPress: () => void;
}
const UserItem: FC<UserItem> = ({ user, onPress }) => {
  const { styles } = useStyles(styleSheet);
  return (
    <RectButton
      style={styles.eventItem}
      onPress={() => onPress()}
    >
      <Image
        style={{ width: 48, height: 48, borderRadius: 100 }}
        source={{
          thumbhash: user.photos[0]?.placeholder,
          uri: user.photos[0]?.url ?? defaultImgPlaceholder
        }}
      />

      <VStack
        $y='center'
        styles={{ flex: 1 }}
      >
        <TextView bold={true} ellipsis={true}>
          {user?.name}
        </TextView>
        <TextView ellipsis={true}>
          {user?.username}
        </TextView>
      </VStack>
    </RectButton>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  eventItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sp4,
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sp6,
    width: '100%'
  }
}));
