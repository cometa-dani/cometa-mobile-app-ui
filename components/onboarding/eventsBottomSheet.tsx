import { LikeableEvent } from '@/models/Event';
import { useInfiniteQuerySearchUsers } from '@/queries/search/useInfiniteQuerySearchUsers';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { FC, forwardRef, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { If } from '../utils/ifElse';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { gray_200, gray_500, gray_900, red_100 } from '@/constants/colors';
import { GetBasicUserProfile } from '@/models/User';
import { Image } from 'expo-image';

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
    usersSearchedList?.pages.flatMap(page => page.items) || [],
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
        {/* <If
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
        /> */}

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
      // style={styles.eventItem}
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
      // style={styles.eventItem}
      onPress={() => onPress()}
    >
      <Image
        style={{ width: 38, height: 38, borderRadius: 100 }}
        source={{
          thumbhash: user.photos[0]?.placeholder,
          uri: user.photos[0]?.url ?? ''
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
