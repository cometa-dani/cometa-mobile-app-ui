import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, router } from 'expo-router';
import { AppSearchInput } from '../../components/textInput/AppSearchInput';
import { RectButton, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { gray_200, gray_500, gray_900 } from '../../constants/colors';
import { If } from '../../components/utils';
import { useInfiniteQuerySearchUsers } from '../../queries/search/useInfiniteQuerySearchUsers';
import { useInfiniteQuerySearchEventsByQueryParams } from '../../queries/loggedInUser/eventHooks';
import { useCometaStore } from '../../store/cometaStore';
import { SkeletonLoaderList } from '../../components/lodingSkeletons/LoadingSkeletonList';
import { FlashList } from '@shopify/flash-list';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { defaultImgPlaceholder } from '../../constants/vars';
import { GetBasicUserProfile } from '../../models/User';
import { LikeableEvent } from '../../models/Event';


export default function SearchScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const [toggleTabs, setToggleTabs] = useState(true);
  const inputSearchPlacesRef = useRef<TextInput>(null);

  const [searchPlaces, setSearchPlaces] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  // debounce search inputs
  const setDebounceSearchPlaces = useCometaStore(state => state.setSearchQuery);
  const [debouncedSearchUsers, setDebouncedSearchUsers] = useState('');
  const debounceSearchPlaces = useCometaStore(state => state.searchQuery);
  const setScrollToIndex = useCometaStore(state => state.setScrollToIndex);
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuerySearchEventsByQueryParams(debounceSearchPlaces);
  const usersSearch = useInfiniteQuerySearchUsers(debouncedSearchUsers);

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

  // debounce search input for places
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebounceSearchPlaces(searchPlaces);
    }, 1_400);
    return () => clearTimeout(timeOutId);
  }, [searchPlaces]);

  // search
  const evenstData = useMemo(() => (
    data?.pages.flatMap(page => page.events) || []
  ), [data?.pages]);
  const usersData = useMemo(() => (
    usersSearch.data?.pages.flatMap(page => page.users) || []
  ), [usersSearch.data?.pages]);
  const handleUserInfiniteScroll = () => !usersSearch.isLoading && usersSearch.hasNextPage && usersSearch.fetchNextPage();
  const handleEventsInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  const handleEventPress = (index: number) => {
    setScrollToIndex(index);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: 'Search',
          headerTitleAlign: 'center'
        }}
      />

      <View style={{ padding: 20, paddingTop: 0 }}>
        <If
          condition={toggleTabs}
          render={(
            <AppSearchInput
              setValue={(text) => {
                // if (!text.length && debounceSearchPlaces.length) return;
                setSearchPlaces(text);
              }}
              value={searchPlaces}
              placeholder="Search new places..."
              // (ref as RefObject<BottomSheetModal>)?.current?.expand();
              // onSearch={() => props.onSearchQuery(searchPlaces)}
              ref={inputSearchPlacesRef}
            />
          )}
          elseRender={(
            <AppSearchInput
              setValue={setSearchUsers}
              value={searchUsers}
              placeholder="Search new people..."
            />
          )}
        />

        <View style={bottomSheetStyles.tabs}>
          <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
            <Text style={[bottomSheetStyles.tab, toggleTabs && { ...bottomSheetStyles.tabActive, color: '#83C9DD' }]}>Places</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
            <Text style={[bottomSheetStyles.tab, !toggleTabs && { ...bottomSheetStyles.tabActive, color: '#E44063' }]}>Users</Text>
          </TouchableOpacity>
        </View>
      </View>

      <If
        condition={toggleTabs}
        render={(
          <If
            condition={isLoading}
            render={(
              <SkeletonLoaderList height={54} gap={8} />
            )}
            elseRender={(
              <FlashList
                showsVerticalScrollIndicator={true}
                onEndReached={handleEventsInfiniteFetch}
                onEndReachedThreshold={0.5}
                estimatedItemSize={54}
                contentContainerStyle={{ paddingTop: 12 }}
                data={evenstData}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item: event, index }) => {
                  return (
                    <EventItem
                      key={event.id}
                      event={event}
                      onPress={() => handleEventPress(index)}
                    />
                  );
                }}
              />
            )}
          />
        )}
        elseRender={(
          <If
            condition={usersSearch.isLoading}
            render={(
              <SkeletonLoaderList height={54} gap={8} />
            )}
            elseRender={(
              <FlashList
                showsVerticalScrollIndicator={true}
                onEndReached={handleUserInfiniteScroll}
                onEndReachedThreshold={0.5}
                estimatedItemSize={54}
                contentContainerStyle={{ paddingTop: 12 }}
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
              />
            )}
          />
        )}
      />
    </SafeAreaView>
  );
}


interface ItemProps {
  event: LikeableEvent;
  onPress: () => void;
}

const EventItem: FC<ItemProps> = ({ event, onPress }) => {
  return (
    <RectButton
      style={styles.eventItem}
      onPress={() => onPress()}
    >
      <FontAwesome6 name="location-dot" size={22} color={gray_900} />

      <Text
        numberOfLines={1}
        ellipsizeMode='tail'
        style={{
          flex: 8 / 8,
          fontWeight: '700',
        }}
      >
        {event.name}
      </Text>

    </RectButton>
  );
};


interface UserItem {
  user: Omit<GetBasicUserProfile, 'outgoingFriendships' | 'incomingFriendships'>,
  onPress: () => void;
}

const UserItem: FC<UserItem> = ({ user, onPress }) => {
  return (
    <RectButton
      style={styles.eventItem}
      onPress={() => onPress()}
    >
      <Image
        style={{ width: 38, height: 38, borderRadius: 100 }}
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
          fontWeight: '700',
        }}
      >
        {user.username}
      </Text>

    </RectButton>
  );
};

const bottomSheetStyles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    alignItems: 'center'
  },

  tab: {
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: gray_500
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: gray_200
  }
});

const styles = StyleSheet.create({
  eventItem: {
    paddingHorizontal: 20,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20
  }
});
