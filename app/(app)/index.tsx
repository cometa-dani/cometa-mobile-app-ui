import React, { FC, forwardRef, useCallback, useRef, useState, RefObject, } from 'react';
import { StyleSheet, SafeAreaView, Pressable, View, TouchableOpacity } from 'react-native';
import { Text, useColors } from '../../components/Themed';
import { useInfiniteQuerySearchEventsByQueryParams } from '../../queries/loggedInUser/eventHooks';
import { EventsFlashList } from '../../components/eventsFlashList/eventsFlashList';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { If } from '../../components/utils';
import { gray_200, gray_300, gray_500, gray_900, red_100 } from '../../constants/colors';
import { RectButton } from 'react-native-gesture-handler';
import { Tabs, router } from 'expo-router';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { LikeableEvent } from '../../models/Event';
import { Image } from 'expo-image';
import { AppSearchInput } from '../../components/textInput/AppSearchInput';


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
const snapPoints = ['35%', '50%', '100'];

interface BottonSheetSearchEventsProps {
  events: LikeableEvent[],
  isLoading: boolean,
  onPressEventItem: (index: number) => void,
  onInfiniteScroll: () => void,
  onSearchQuery: (query: string) => void,
}

export const BottonSheetSearchEvents = forwardRef<BottomSheetModal, BottonSheetSearchEventsProps>((props, ref) => {
  const [index, setIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSheetChanges = useCallback((index: number) => setIndex(index), []);
  const [toggleTabs, setToggleTabs] = useState(true);

  const Backdrop: FC<BottomSheetBackdropProps> = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
      />
    ),
    []
  );

  const FloatingButton: FC<BottomSheetFooterProps> =
    (props) => (
      <BottomSheetFooter  {...props} bottomInset={20}>
        <TouchableOpacity
          onPress={() => {
            if (index <= 1) {
              (ref as RefObject<BottomSheetModal>)?.current?.expand();
            }
            if (index == 2) {
              (ref as RefObject<BottomSheetModal>)?.current?.snapToIndex(1);
            }
          }}
          style={bottomSheetStyles.footerContainer}
        >
          <If
            condition={index <= 1}
            render={(
              <FontAwesome6 name="angle-up" size={22} color="white" />
            )}
          />
          <If
            condition={index == 2}
            render={(
              <FontAwesome6 name="angle-down" size={22} color="white" />
            )}
          />
        </TouchableOpacity>
      </BottomSheetFooter>
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
      // handleComponent={(props) => props.}
      backdropComponent={Backdrop}
      footerComponent={FloatingButton}
    >
      <BottomSheetView
        style={bottomSheetStyles.contentContainer}
        focusable={true}
      >
        {/* <TextInput
          placeholder="Search for events"
          value={props.searchQuery}
          // onFocus={() => (ref as RefObject<BottomSheetModal>)?.current?.expand()}
          onChangeText={(val) => {
            if ((index) != 2) {
              // (ref as RefObject<BottomSheetModal>)?.current?.expand();
            }
            props.setSearchQuery(val);
          }}
          style={bottomSheetStyles.input}
        /> */}

        <AppSearchInput
          setValue={setSearchQuery}
          value={searchQuery}
          placeholder="Search..."
          onSearch={() => props.onSearchQuery(searchQuery)}
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
        condition={props.isLoading}
        render={(
          <View style={{ padding: 20 }}>
            <Text>Loading...</Text>
          </View>
        )}
        elseRender={(
          <BottomSheetFlatList
            showsVerticalScrollIndicator={true}
            onEndReached={props.onInfiniteScroll}
            onEndReachedThreshold={0.5}
            // contentContainerStyle={{ height: 100, overflow: 'scroll' }}
            style={{ width: '100%', flex: 1, marginVertical: 12 }}
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
          flex: 7 / 8,
          fontWeight: '700',
        }}
      >
        {event.name}
      </Text>

      <Image
        style={{ width: 38, height: 38, borderRadius: 100 }}
        source={{
          thumbhash: event.photos[0].placeholder,
          uri: event.photos[0].url
        }}
      />
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

  // input: {
  //   borderRadius: 10,
  //   fontSize: 16,
  //   lineHeight: 20,
  //   width: '100%',
  //   padding: 8,
  //   backgroundColor: 'rgba(151, 151, 151, 0.08)',
  // },
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 16,
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
