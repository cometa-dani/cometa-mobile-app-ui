import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ReactNode, useCallback, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetPaginatedCities } from '../../../queries/currentUser/editProfileHooks';
import { TextView } from '@/components/text/text';
import { Heading } from '@/components/text/heading';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Condition } from '../../utils/ifElse';
import { Center, HStack, VStack } from '../../utils/stacks';
import { ICityKind, useSelectCityByName } from './hook';
import { ICityDatum } from '@/models/Cities';
import { SearchField } from '@/components/input/searchField';


const placeholders: ICityKind = {
  homeTown: 'Select your Home Town...',
  currentLocation: 'Select your Current Location...'
};

export function SearchCityByName(): ReactNode {
  const router = useRouter();
  const { setSelectedCity, cityKind } = useSelectCityByName();
  const { styles: cityStyles, theme } = useStyles(styleSheet);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetched
  } = useInfiniteQueryGetPaginatedCities(searchValue);
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const citiesData = data?.pages.flatMap(page => page.items) ?? [];

  const renderItem = useCallback(({ item }: { item: ICityDatum }) => (
    <TouchableOpacity
      style={cityStyles.city}
      onPress={() => {
        setSelectedCity({ [cityKind]: item.city });
        router.back();
      }}
    >
      <VStack>
        <HStack $y='center' gap={theme.spacing.sp2}>
          <TextView ellipsis={true} style={{ maxWidth: 160 }}>{item.city}</TextView>
          <FontAwesome name='flag-o' size={20} />
        </HStack>
        <Heading ellipsis={true} style={{ maxWidth: 180 }} size='s4'>{item.country}</Heading>
      </VStack>
      <TextView ellipsis={true} style={{ maxWidth: 100 }}>{item.country}</TextView>
    </TouchableOpacity>
  ), [setSelectedCity]);

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'default',
          headerBackTitle: '',
          headerTitle: () => (
            <SearchField
              ref={inputRef}
              placeholder={placeholders[cityKind]}
              onSearch={setSearchValue}
            />
          )
        }}
      />
      <View style={{ flex: 1, flexGrow: 1 }}>
        <Condition
          if={isFetched}
          then={(
            <Condition
              if={citiesData.length === 0}
              then={(
                <Center styles={{ flex: 1 }}>
                  <TextView style={{ padding: theme.spacing.sp8, textAlign: 'center' }}>
                    No cities found
                  </TextView>
                </Center>
              )}
              else={
                <FlashList
                  estimatedItemSize={theme.spacing.sp20}
                  data={citiesData}
                  bounces={false}
                  onEndReached={handleInfiniteFetch}
                  onEndReachedThreshold={0.1}
                  contentContainerStyle={{ padding: theme.spacing.sp8 }}
                  ListFooterComponentStyle={{ height: theme.spacing.sp11 * 10 }} // 280px height
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderItem}
                />
              }
            />
          )}
          else={(
            <Center styles={{ flex: 1 }}>
              <ActivityIndicator
                size="large"
                style={{ marginTop: -theme.spacing.sp8 }}
                color={theme.colors.red100}
              />
            </Center>
          )}
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
  }
}));
