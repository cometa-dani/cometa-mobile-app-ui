import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { FC, ReactNode, useCallback, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
// import { useInfiniteQueryGetPaginatedCities } from '../../../queries/currentUser/editProfileHooks';
import { TextView } from '@/components/text/text';
import { Heading } from '@/components/text/heading';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
// import { Condition } from '../../utils/ifElse';
// import { Center, HStack, VStack } from '../../utils/stacks';
// import { ICityKind, useSelectCityByName } from './hook';
import { ICityDatum } from '@/models/Cities';
import { SearchField } from '@/components/input/searchField';
import { EventCategory } from '@/models/Event';
import { useCometaStore } from '@/store/cometaStore';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import Checkbox from 'expo-checkbox';


// const placeholders: ICityKind = {
//   homeTown: 'Select your Home Town...',
//   currentLocation: 'Select your Current Location...'
// };

export default function FilterScreen(): ReactNode {
  const router = useRouter();
  // const { setSelectedCity, cityKind } = useSelectCityByName();
  const { styles: cityStyles, theme } = useStyles(styleSheet);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  // const {
  //   data,
  //   isFetching,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetched
  // } = useInfiniteQueryGetPaginatedCities(searchValue);
  // const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  // const citiesData = data?.pages.flatMap(page => page.items) ?? [];

  // const renderItem = useCallback(({ item }: { item: ICityDatum }) => (
  //   <TouchableOpacity
  //     style={cityStyles.city}
  //     onPress={() => {
  //       setSelectedCity({ [cityKind]: item.city });
  //       router.back();
  //     }}
  //   >
  //     <VStack>
  //       <HStack $y='center' gap={theme.spacing.sp2}>
  //         <TextView ellipsis={true} style={{ maxWidth: 160 }}>{item.city}</TextView>
  //         <FontAwesome name='flag-o' size={20} />
  //       </HStack>
  //       <Heading ellipsis={true} style={{ maxWidth: 180 }} size='s4'>{item.country}</Heading>
  //     </VStack>
  //     <TextView ellipsis={true} style={{ maxWidth: 100 }}>{item.country}</TextView>
  //   </TouchableOpacity>
  // ), [setSelectedCity]);
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

  const renderItem = useCallback(({ item }: { item: EventCategory }) => {
    return (
      <Item
        title={item}
        isChecked={storedSearchFilters[item] !== undefined}
        onSelectOption={setStoredSearchFilters}
      />
    );
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle: '',
          headerTitle: () => (
            <SearchField
              ref={inputRef}
              placeholder={''}
              onSearch={setSearchValue}
            />
          )
        }}
      />
      <View style={{ flex: 1, flexGrow: 1 }}>
        <FlashList
          estimatedItemSize={theme.spacing.sp20}
          data={filterOptions}
          bounces={false}
          // onEndReached={handleInfiniteFetch}
          // onEndReachedThreshold={0.5}
          disableAutoLayout={true}
          contentContainerStyle={{ padding: theme.spacing.sp8 }}
          ListFooterComponentStyle={{ height: tabBarHeight * 3 }} // 280px height
          keyExtractor={item => item.toString()}
          renderItem={renderItem}
        />
      </View>
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  city: {
    flex: 1,
    flexDirection: 'row',
    height: theme.spacing.sp22,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  },
}));


interface ItemProps {
  title: EventCategory;
  isChecked: boolean;
  onSelectOption: (category: EventCategory) => void;
}

const Item: FC<ItemProps> = ({ title, isChecked, onSelectOption }) => {
  const { styles, theme } = useStyles(styleSheet);
  return (
    <TouchableOpacity
      onPress={() => onSelectOption(title)}
      style={styles.option}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? theme.colors.red100 : undefined}
      />
      <View style={styles.titleContainer}>
        <Text>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
