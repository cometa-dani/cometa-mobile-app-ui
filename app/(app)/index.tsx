import React, { FC, useCallback, useRef } from 'react';
import { StyleSheet, SafeAreaView, Pressable, TextInput } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { useInfiniteQueryGetLatestEventsByLoggedInUser } from '../../queries/loggedInUser/eventHooks';
import { EventsFlashList } from '../../components/eventsFlashList/eventsFlashList';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { If } from '../../components/utils';
import { gray_300, gray_900 } from '../../constants/colors';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Tabs, router } from 'expo-router';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { EventCategory } from '../../models/Event';
import { FlashList } from '@shopify/flash-list';
import Checkbox from 'expo-checkbox';


const filterOptions = [
  EventCategory.EDUCATIONAL,
  EventCategory.CULTURAL,
  EventCategory.SPORTS,
  EventCategory.PARTY,
  EventCategory.CINEMA,
  EventCategory.SHOWS,
  EventCategory.GALLERY,
  EventCategory.PARK,
  EventCategory.EXHIBITION,
  EventCategory.MUSEUM,
  EventCategory.THEATRE,
  EventCategory.FESTIVAL,
  EventCategory.CAFE,
  EventCategory.CLUB,
  EventCategory.RESTAURANT,
  EventCategory.CONCERT,
  EventCategory.BRUNCH,
];

export default function HomeScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  // eventsData
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQueryGetLatestEventsByLoggedInUser();
  const evenstData = data?.pages.flatMap(page => page.events) || [];

  // handling fetch when reaching the end
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
    // bottomSheetRef.current.
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const snapPoints = ['35%', '50%', '100%'];
  const renderBackdrop: FC<BottomSheetBackdropProps> = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
      // disappearsOnIndex={0}
      // appearsOnIndex={-1}
      />
    ),
    []
  );
  const renderFooter: FC<BottomSheetFooterProps> = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={20}>
        <View style={bottomSheetStyles.footerContainer}>
          <Text style={bottomSheetStyles.footerText}>Search</Text>
        </View>
      </BottomSheetFooter>
    ),
    []
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Tabs.Screen
        // name="index"
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
                  style={{ marginLeft: 18, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <BottomSheetModal
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
        ref={bottomSheetRef}
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
          <TextInput style={bottomSheetStyles.input} />
          <Text>Awesome 🎉</Text>

          <FlashList
            contentContainerStyle={{ paddingBottom: 20 }}
            // stickyHeaderHiddenOnScroll={true}
            estimatedItemSize={50}
            data={filterOptions}
            renderItem={({ item: option }) => {
              return (
                <Item
                  title={option}
                  isChecked={false}
                  onSelectOption={() => null}
                />
              );
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
      <View style={styles.container}>
        <If
          condition={!evenstData?.length && !isLoading}
          render={(
            <NotEventsFound />
          )}
          elseRender={(
            <>
              <EventsFlashList
                items={evenstData}
                isLoading={isLoading || isRefetching}
                onInfiniteScroll={handleInfiniteFetch}
              />
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
}



interface ItemProps {
  title: EventCategory;
  isChecked: boolean;
  onSelectOption: (category: EventCategory) => void;
}

const Item: FC<ItemProps> = ({ title, isChecked, onSelectOption }) => {
  return (
    <RectButton
      onPress={() => onSelectOption(title)}
      style={styles.option}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? gray_900 : undefined}
      />
      <View style={styles.titleContainer}>
        <Text style={{ fontWeight: '700' }}>
          {title}
        </Text>
      </View>
    </RectButton>
  );
};



// const styles = StyleSheet.create({

// });


const bottomSheetStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    // height: '100%',
    alignItems: 'center',
    paddingTop: 10,
    padding: 20
    // backgroundColor: '#eee',
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
    padding: 12,
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
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

  option: {
    paddingHorizontal: 24,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  checkbox: {
    borderRadius: 5,
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

  notFoundContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26 },
});
