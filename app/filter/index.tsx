import { StyleSheet, SafeAreaView, View } from 'react-native';
import { useColors, Text, } from '../../components/Themed';
import { Stack, router } from 'expo-router';
import { RectButton } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import { gray_900 } from '../../constants/colors';
import { FlashList } from '@shopify/flash-list';
import { FC } from 'react';
import { EventCategory } from '../../models/Event';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../queries/queryKeys';
import { AppButton } from '../../components/buttons/buttons';


export default function SettingsScreen(): JSX.Element {
  const { background } = useColors();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: 'Find liked minded people',
          headerTitleAlign: 'center'
        }}
      />
      <Text size='lg' style={{ paddingHorizontal: 24, paddingVertical: 10 }}>Category</Text>
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
        <AppButton
          text='Apply'
          btnColor='black'
          onPress={() => {
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.SEARCH_EVENTS_WITH_PAGINATION]
            });
            router.back();
          }}
        />
      </View>
    </SafeAreaView >
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
        <Text>
          {title}
        </Text>
      </View>
    </RectButton>
  );
};


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
  }
});
