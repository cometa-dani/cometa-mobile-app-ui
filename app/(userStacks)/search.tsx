import { FC, ReactNode } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
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


export default function SearchScreen(): ReactNode {
  const setSelectedTargetUser = useCometaStore(state => state.setTargetUser);
  const [searchUsers, setSearchUsers] = useDebouncedState('');
  const usersSearch = useInfiniteQuerySearchUsers(searchUsers ?? '@');
  const usersData = usersSearch.data?.pages.flatMap(page => page.items) || [];

  const handleUserInfiniteScroll = () => {
    if (!usersSearch.isLoading && usersSearch.hasNextPage) {
      usersSearch.fetchNextPage();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Search',
          headerTitleAlign: 'center',
          headerSearchBarOptions: {
            autoFocus: true,
            placeholder: 'Search for events',
          },
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, height: '100%' }}>
          <Condition
            if={usersSearch.isLoading}
            then={(<AvatarSkeletonList items={11} />)}
            else={(
              <FlashList
                contentInset={{ bottom: tabBarHeight * 2 }}
                showsVerticalScrollIndicator={true}
                onEndReached={handleUserInfiniteScroll}
                onEndReachedThreshold={0.5}
                estimatedItemSize={44}
                data={usersData}
                keyExtractor={item => item.id.toString()}
                ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
                renderItem={({ item: user }) => {
                  return (
                    <UserItem
                      key={user.id}
                      user={user}
                      onPress={() => {
                        setSelectedTargetUser(user as IGetTargetUser);
                        router.replace('/(userStacks)/targetUser');
                      }}
                    />
                  );
                }}
              />
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
}


interface UserItem {
  user: IGetBasicUserProfile,
  onPress: () => void;
}
const UserItem: FC<UserItem> = ({ user, onPress }) => {
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

      <TextView
        ellipsis={true}
        style={{ flex: 1 }}
      >
        {user.username}
      </TextView>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%'
  }
});
