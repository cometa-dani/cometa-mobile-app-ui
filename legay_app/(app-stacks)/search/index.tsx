import React, { FC, useEffect, useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../../legacy_components/Themed';
import { Stack, router } from 'expo-router';
import { AppSearchInput } from '../../../legacy_components/textInput/AppSearchInput';
import { RectButton, } from 'react-native-gesture-handler';
import { If } from '../../../legacy_components/utils';
import { useInfiniteQuerySearchUsers } from '../../../queries/search/useInfiniteQuerySearchUsers';
import { SkeletonLoaderList } from '../../../legacy_components/lodingSkeletons/LoadingSkeletonList';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { defaultImgPlaceholder } from '../../../constants/vars';
import { IGetBasicUserProfile } from '../../../models/User';


export default function SearchScreen(): JSX.Element {
  // colors
  const { background } = useColors();

  const [searchUsers, setSearchUsers] = useState('');
  // debounce search inputs
  const [debouncedSearchUsers, setDebouncedSearchUsers] = useState('');
  const usersSearch = useInfiniteQuerySearchUsers(debouncedSearchUsers ?? '@');

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchUsers.length) {
        setDebouncedSearchUsers(searchUsers);
      }
      else {
        setDebouncedSearchUsers('@');
      }
    }, 1_400);
    return () => clearTimeout(timeOutId);
  }, [searchUsers]);


  // search
  const usersData = useMemo(() => (
    usersSearch.data?.pages.flatMap(page => page.items) || []
  ), [usersSearch.data?.pages]);

  const handleUserInfiniteScroll = () => !usersSearch.isLoading && usersSearch.hasNextPage && usersSearch.fetchNextPage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          headerShadowVisible: false,
          headerTitle: 'Search',
          headerTitleAlign: 'center'
        }}
      />

      <View style={{ padding: 20, paddingTop: 0, paddingBottom: 0 }}>
        <AppSearchInput
          setValue={setSearchUsers}
          value={searchUsers}
          placeholder="Search new people..."
        />
      </View>

      <If
        condition={usersSearch.isLoading}
        render={(
          <SkeletonLoaderList height={58} gap={8} />
        )}
        elseRender={(
          <FlashList
            showsVerticalScrollIndicator={true}
            onEndReached={handleUserInfiniteScroll}
            onEndReachedThreshold={0.5}
            estimatedItemSize={54}
            contentContainerStyle={{ paddingTop: 0 }}
            data={usersData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item: user }) => {
              return (
                <UserItem
                  key={user.id}
                  user={user}
                  onPress={() => router.push(`/targetUserProfile/${user.uid}`)}
                />
              );
            }}
          />)}
      />
    </SafeAreaView>
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
        style={{ width: 42, height: 42, borderRadius: 100 }}
        source={{
          thumbhash: user.photos[0]?.placeholder,
          uri: user.photos[0]?.url ?? defaultImgPlaceholder
        }}
      />

      <Text
        numberOfLines={1}
        ellipsizeMode='tail'
        style={{
          flex: 1,
        }}
      >
        {user.username}
      </Text>

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
