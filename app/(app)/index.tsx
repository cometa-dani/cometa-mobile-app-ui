import React, { FC, forwardRef, useCallback, useRef, useState, RefObject, } from 'react';
import { StyleSheet, SafeAreaView, Pressable, TextInput, View, TouchableOpacity } from 'react-native';
import { Text, useColors } from '../../components/Themed';
import { useInfiniteQueryGetLatestEventsByLoggedInUser } from '../../queries/loggedInUser/eventHooks';
import { EventsFlashList } from '../../components/eventsFlashList/eventsFlashList';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { If } from '../../components/utils';
import { gray_300, gray_900, red_100 } from '../../constants/colors';
import { RectButton } from 'react-native-gesture-handler';
import { Tabs, router } from 'expo-router';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { EventCategory, LikeableEvent } from '../../models/Event';


export default function HomeScreen(): JSX.Element {
  const { background } = useColors();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
    // bottomSheetRef.
  }, []);

  // eventsData
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQueryGetLatestEventsByLoggedInUser();
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
        ref={bottomSheetRef}
        events={evenstData}
        onPressEventItem={setScrollToIndex}
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

interface BottonSheetSearchEventsProps {
  events: LikeableEvent[],
  onPressEventItem: (index: number) => void
}

export const BottonSheetSearchEvents = forwardRef<BottomSheetModal, BottonSheetSearchEventsProps>((props, ref) => {
  const [index, setIndex] = useState(1);
  const snapPoints = ['35%', '50%', '100%'];

  const handleSheetChanges = useCallback((index: number) => setIndex(index), []);

  const renderBackdrop: FC<BottomSheetBackdropProps> = useCallback(
    (props) => (
      <BottomSheetBackdrop
        // onPress={() => setIndex(1)}
        {...props}
      />
    ),
    []
  );

  const renderFooter: FC<BottomSheetFooterProps> =
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
      containerStyle={{ position: 'absolute' }}
      backgroundStyle={{
        flex: 1,
        backgroundColor: '#fcfcfc',
        elevation: 1,
        shadowColor: '#171717', // add shadow for iOS
        shadowOffset: {
          width: 4,
          height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }}
      index={1}
      ref={ref}
      keyboardBehavior="fillParent"
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
    >
      <BottomSheetView
        style={bottomSheetStyles.contentContainer}
        focusable={true}
      >
        <TextInput
          // onFocus={() => (ref as RefObject<BottomSheetModal>)?.current?.expand()}
          onChangeText={() => {
            if ((index) != 2) {
              // (ref as RefObject<BottomSheetModal>)?.current?.expand();
            }
          }}
          style={bottomSheetStyles.input}
        />
        <Text>Awesome 🥳</Text>

      </BottomSheetView>

      <BottomSheetFlatList
        showsVerticalScrollIndicator={true}
        style={{ width: '100%', flex: 1 }}
        data={props.events}
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
    </BottomSheetModal>
  );
});

BottonSheetSearchEvents.displayName = 'BottonSheetModalSearchEvents';


interface ItemProps {
  event: LikeableEvent;
  onPress: (category: EventCategory) => void;
}

const EventItem: FC<ItemProps> = ({ event, onPress }) => {
  return (
    <RectButton
      style={styles.eventItem}
    >
      <FontAwesome6 name="location-dot" size={22} color={gray_900} />
      <View style={styles.titleContainer}>
        <Text style={{ fontWeight: '700' }}>
          {event.name}
        </Text>
      </View>
    </RectButton>
  );
};


const bottomSheetStyles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    paddingTop: 10,
    padding: 20
  },

  input: {
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    width: '100%',
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.08)',
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
    paddingTop: 2
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
    paddingHorizontal: 24,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  titleContainer: {
    alignItems: 'center',
    gap: 8
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
