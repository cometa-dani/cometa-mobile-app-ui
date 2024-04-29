import React, { FC, forwardRef, useCallback, useRef, useState, RefObject, useEffect, useMemo, } from 'react';
import { StyleSheet, SafeAreaView, Pressable, View, TouchableOpacity } from 'react-native';
import { Text, useColors } from '../../components/Themed';
import { useInfiniteQuerySearchEventsByQueryParams } from '../../queries/loggedInUser/eventHooks';
import { EventsFlashList } from '../../components/eventsFlashList/eventsFlashList';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { If } from '../../components/utils';
import { gray_200, gray_300, gray_500, gray_900, red_100 } from '../../constants/colors';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { Tabs, router } from 'expo-router';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { LikeableEvent } from '../../models/Event';
import { Image } from 'expo-image';
import { AppSearchInput } from '../../components/textInput/AppSearchInput';
import { useInfiniteQuerySearchUsers } from '../../queries/search/useInfiniteQuerySearchUsers';
import { GetBasicUserProfile } from '../../models/User';
import { defaultImgPlaceholder } from '../../constants/vars';
import { SkeletonLoaderList } from '../../components/lodingSkeletons/LoadingSkeletonList';


export default function HomeScreen(): JSX.Element {
  const { background } = useColors();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  // eventsData
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQuerySearchEventsByQueryParams(searchQuery);
  const evenstData = data?.pages.flatMap(page => page.events) || [];
  const [scrollToIndex, setScrollToIndex] = useState(0);

  // handling fetch when reaching the end
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Tabs.Screen
        options={{
          headerTitleAlign: 'center',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={handlePresentModalPress}>
              {({ pressed }) => (
                <Ionicons
                  name="search"
                  size={32}
                  color={gray_300}
                  style={{
                    marginLeft: 18,
                    opacity: pressed ? 0.5 : 1
                  }}
                />
              )}
            </Pressable>
          ),
        }}
      />

      <BottonSheetSearchEvents
        onSearchQuery={setSearchQuery}
        onPressEventItem={setScrollToIndex}
        onInfiniteScroll={handleInfiniteFetch}
        isLoading={isLoading || isRefetching}
        ref={bottomSheetRef}
        events={evenstData}
      />

      <View style={styles.container}>
        <If
          condition={!evenstData?.length && !isLoading}
          render={(
            <NotEventsFound />
          )}
          elseRender={(
            <EventsFlashList
              initialScrollIndex={scrollToIndex}
              items={evenstData}
              isLoading={isLoading || isRefetching}
              onInfiniteScroll={handleInfiniteFetch}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// coulbe the case that when dragging up add the 100% snap point
const snapPoints = ['35%', '50%'];

interface BottonSheetSearchEventsProps {
  events: LikeableEvent[],
  isLoading: boolean,
  onPressEventItem: (index: number) => void,
  onInfiniteScroll: () => void,
  onSearchQuery: (query: string) => void,
}

export const BottonSheetSearchEvents = forwardRef<BottomSheetModal, BottonSheetSearchEventsProps>((props, ref) => {
  const [index, setIndex] = useState(1);
  const [toggleTabs, setToggleTabs] = useState(true);
  const inputSearchPlacesRef = useRef<TextInput>(null);
  const [searchPlaces, setSearchPlaces] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const [debouncedSearchUsers, setDebouncedSearchUsers] = useState('');
  const { data: usersSearchedList, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuerySearchUsers(debouncedSearchUsers);
  const handleUserInfiniteScroll = () => !isLoading && hasNextPage && fetchNextPage();

  const memoizedSearchUsers = useMemo(() =>
    usersSearchedList?.pages.flatMap(page => page.users) || [],
    [usersSearchedList]);

  // debounce search input for users
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchUsers.length) {
        setDebouncedSearchUsers(searchUsers);
      }
      else {
        setDebouncedSearchUsers('@');
      }
    }, 1_600);
    return () => clearTimeout(timeOutId);
  }, [searchUsers]);

  // debounce search input for places
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchPlaces.length) {
        props.onSearchQuery(searchPlaces);
      }
    }, 1_600);
    return () => clearTimeout(timeOutId);
  }, [searchPlaces]);


  const handleSheetChanges = useCallback((index: number) => setIndex(index), []);


  const Backdrop: FC<BottomSheetBackdropProps> = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
      />
    ),
    []
  );

  const FloatingButton: FC<BottomSheetFooterProps> = useCallback(
    (props) => (
      <BottomSheetFooter  {...props} bottomInset={20}>
        <TouchableOpacity
          onPress={() => {
            if (index == 0) {
              (ref as RefObject<BottomSheetModal>)?.current?.expand();
            }
            if (index == 1) {
              (ref as RefObject<BottomSheetModal>)?.current?.snapToIndex(0);
            }
          }}
          style={bottomSheetStyles.footerContainer}
        >
          <If
            condition={index <= 0}
            render={(
              <FontAwesome6 name="angle-up" size={22} color="white" />
            )}
          />
          <If
            condition={index == 1}
            render={(
              <FontAwesome6 name="angle-down" size={22} color="white" />
            )}
          />
        </TouchableOpacity>
      </BottomSheetFooter>
    ),
    [index]
  );


  return (
    <BottomSheetModal
      containerStyle={{ position: 'absolute', }}
      backgroundStyle={bottomSheetStyles.background}
      index={1}
      ref={ref}
      keyboardBehavior="fillParent"
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      backdropComponent={Backdrop}
      footerComponent={FloatingButton}
    >
      <BottomSheetView
        style={bottomSheetStyles.contentContainer}
        focusable={true}
      >
        <If
          condition={toggleTabs}
          render={(
            <AppSearchInput
              setValue={setSearchPlaces}
              value={searchPlaces}
              placeholder="Search new places..."
              // (ref as RefObject<BottomSheetModal>)?.current?.expand();
              onSearch={() => props.onSearchQuery(searchPlaces)}
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
      </BottomSheetView>

      <If
        condition={toggleTabs}
        render={(
          <If
            condition={props.isLoading}
            render={(
              <SkeletonLoaderList height={44} gap={8} />
            )}
            elseRender={(
              <BottomSheetFlatList
                showsVerticalScrollIndicator={true}
                onEndReached={props.onInfiniteScroll}
                onEndReachedThreshold={0.5}
                // contentContainerStyle={{ height: 100, overflow: 'scroll' }}
                style={{ width: '100%', flex: 1, marginTop: 12 }}
                data={props.events}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item: event, index }) => {
                  return (
                    <EventItem
                      key={event.id}
                      event={event}
                      onPress={() => props.onPressEventItem(index)}
                    />
                  );
                }}
              />
            )}
          />
        )}
        elseRender={(
          <If
            condition={isLoading}
            render={(
              <SkeletonLoaderList height={44} gap={8} />
            )}
            elseRender={(
              <BottomSheetFlatList
                showsVerticalScrollIndicator={true}
                onEndReached={handleUserInfiniteScroll}
                onEndReachedThreshold={0.5}
                // contentContainerStyle={{ height: 100, overflow: 'scroll' }}
                style={{ width: '100%', flex: 1, marginTop: 12 }}
                data={memoizedSearchUsers}
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
    </BottomSheetModal>
  );
});

BottonSheetSearchEvents.displayName = 'BottonSheetModalSearchEvents';


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

  background: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    elevation: 1,
    shadowColor: '#171717', // add shadow for iOS
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  tabs: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    paddingHorizontal: 6
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
  },

  contentContainer: {
    alignItems: 'center',
    paddingTop: 10,
    padding: 20,
    gap: 16
  },

  footerContainer: {
    marginLeft: 'auto', // 'auto' is not working, it should be 'flex-end
    marginRight: 20,
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: red_100,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '800',
    paddingTop: 2,
    elevation: 2,
    shadowColor: '#171717',
    shadowOffset: {
      width: 4,
      height: 5,
    },
  }
});


const NotEventsFound: FC = () => (
  <View style={styles.notFoundContainer}>
    <Text style={{ fontWeight: '600', fontSize: 20 }}>No events found</Text>

    <TouchableOpacity
      style={{ alignItems: 'center' }}
      onPress={() => router.push('/settings')}
    >
      <MaterialCommunityIcons
        name="checkbox-marked-circle-plus-outline"
        size={34}
        color={gray_900}
      />
      <Text style={{ fontSize: 14, marginTop: 6 }}>Change Settings</Text>
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({

  eventItem: {
    paddingHorizontal: 20,
    width: '100%',
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20
  },

  container: {
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 10,
    overflow: 'hidden',
  },

  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26
  },
});
