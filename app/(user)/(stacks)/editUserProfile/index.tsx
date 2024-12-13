import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { AppSearchInput } from '../../../../legacy_components/textInput/AppSearchInput';
import { RectButton, } from 'react-native-gesture-handler';
import { useInfiniteQuerySearchUsers } from '../../../../queries/search/useInfiniteQuerySearchUsers';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { defaultImgPlaceholder } from '../../../../constants/vars';
import { IGetBasicUserProfile } from '../../../../models/User';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { useStyles } from 'react-native-unistyles';


export default function EditUserProfileScreen(): ReactNode {
  const { theme } = useStyles();
  // const [searchUsers, setSearchUsers] = useState('');
  // // debounce search inputs
  // const [debouncedSearchUsers, setDebouncedSearchUsers] = useState('');
  // const usersSearch = useInfiniteQuerySearchUsers(debouncedSearchUsers ?? '@');

  // useEffect(() => {
  //   const timeOutId = setTimeout(() => {
  //     if (searchUsers.length) {
  //       setDebouncedSearchUsers(searchUsers);
  //     }
  //     else {
  //       setDebouncedSearchUsers('@');
  //     }
  //   }, 1_400);
  //   return () => clearTimeout(timeOutId);
  // }, [searchUsers]);


  // // search
  // const usersData = useMemo(() => (
  //   usersSearch.data?.pages.flatMap(page => page.items) || []
  // ), [usersSearch.data?.pages]);

  // const handleUserInfiniteScroll = () => !usersSearch.isLoading && usersSearch.hasNextPage && usersSearch.fetchNextPage();

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'default',
          gestureDirection: 'horizontal',
          contentStyle: { backgroundColor: theme.colors.white80 },
          fullScreenGestureEnabled: true,
          headerShadowVisible: false,
          headerTitle: 'Edit user profile',
          headerTitleAlign: 'center'
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Condition
          if={false}
          then={(
            <Center styles={{ flex: 1 }}>
              <ActivityIndicator
                size="large"
                style={{ marginTop: -theme.spacing.sp8 }}
                color={theme.colors.red100}
              />
            </Center>
          )}
          else={(
            <Center styles={{ flex: 1 }}>
              <TextView>Edit user profile</TextView>
            </Center>
          )}
        />
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
        style={{ width: 42, height: 42, borderRadius: 100 }}
        source={{
          thumbhash: user.photos[0]?.placeholder,
          uri: user.photos[0]?.url ?? defaultImgPlaceholder
        }}
      />

      <TextView
        ellipsis={true}
        style={{
          flex: 1,
        }}
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
