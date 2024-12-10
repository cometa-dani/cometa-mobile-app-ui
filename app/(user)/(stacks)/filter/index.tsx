import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
// import { useColors, Text, } from '../../../legacy_components/Themed';
import { Stack, router } from 'expo-router';
// import { RectButton } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import { gray_900 } from '../../../../constants/colors';
import { FlashList } from '@shopify/flash-list';
import { FC } from 'react';
import { EventCategory } from '../../../../models/Event';
import { useCometaStore } from '../../../../store/cometaStore';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../../../queries/queryKeys';
// import { AppButton } from '../../../legacy_components/buttons/buttons';
import { Heading } from '@/components/text/heading';
import { Button } from '@/components/button/button';


export default function SettingsScreen(): JSX.Element {
  // const { background } = useColors();
  const queryClient = useQueryClient();
  const storedSearchFilters = useCometaStore(state => state.searchFilters);
  const setStoredSearchFilters = useCometaStore(state => state.AddOrDeleteSearchFilter);

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

  // ****************************************************
  // TODO:
  // only should execute when the component is unmounted and has changed the search filters
  // ****************************************************
  // useEffect(() => {
  //   return () => {
  //     queryClient.invalidateQueries({
  //       queryKey: [QueryKeys.GET_LATEST_EVENTS_WITH_PAGINATION]
  //     });
  //   };
  // }, []);


  return (
    <>
      <Stack.Screen options={{ animation: 'default' }} />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
            headerShadowVisible: false,
            headerTitle: 'Find liked minded people',
            headerTitleAlign: 'center'
          }}
        />
        <Heading size='s6' style={{ paddingHorizontal: 24, paddingVertical: 10 }}>Category</Heading>
        <FlashList
          contentContainerStyle={{ paddingBottom: 20 }}
          // stickyHeaderHiddenOnScroll={true}
          estimatedItemSize={50}
          data={filterOptions}
          renderItem={({ item: option }) => {
            return (
              <Item
                title={option}
                isChecked={storedSearchFilters[option] !== undefined}
                onSelectOption={setStoredSearchFilters}
              />
            );
          }}
        />

        <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
          <Button
            variant='primary'
            onPress={() => {
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.SEARCH_EVENTS_WITH_PAGINATION]
              });
              router.back();
            }}
          >
            Apply
          </Button>
        </View>
      </SafeAreaView >
    </>
  );
}


interface ItemProps {
  title: EventCategory;
  isChecked: boolean;
  onSelectOption: (category: EventCategory) => void;
}

const Item: FC<ItemProps> = ({ title, isChecked, onSelectOption }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelectOption(title)}
      style={styles.option}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? gray_900 : undefined}
      />
      <View style={styles.titleContainer}>
        <Text>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  checkbox: {
    borderRadius: 5,
  },

  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    height: 50,
    paddingHorizontal: 24,
    width: '100%',
  },

  titleContainer: {
    alignItems: 'center',
    gap: 8
  }
});
