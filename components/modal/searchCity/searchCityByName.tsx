import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ReactNode, useCallback, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetPaginatedCities } from '../../../queries/currentUser/editProfileHooks';
import { TextView } from '@/components/text/text';
import { Heading } from '@/components/text/heading';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Condition } from '../../utils/ifElse';
import { Center, HStack, VStack } from '../../utils/stacks';
import { useSelectCityByName } from './hook';
import { ICityDatum } from '@/models/Cities';
import { SearchField } from '@/components/input/searchField';


export function SearchCityByName(): ReactNode {
  const router = useRouter();
  const { setCityName, placeholder } = useSelectCityByName();
  const { styles: cityStyles, theme } = useStyles(styleSheet);
  const [searchValue, setSearchValue] = useState('');
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
        setCityName(item.city);
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
  ), [setCityName]);

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'default',
          headerBackButtonDisplayMode: 'minimal',
          headerBackTitle: '',
          headerTitle: () => (
            <SearchField
              placeholder={placeholder}
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
              // no cities
              if={citiesData.length === 0}
              then={(
                <TextView style={{ padding: theme.spacing.sp8, textAlign: 'center' }}>
                  No cities found
                </TextView>
              )}
              // found cities
              else={
                <FlashList
                  estimatedItemSize={theme.spacing.sp20}
                  data={citiesData}
                  bounces={false}
                  onEndReached={handleInfiniteFetch}
                  onEndReachedThreshold={0.1}
                  contentContainerStyle={{ padding: theme.spacing.sp8 }}
                  ListFooterComponentStyle={{ height: theme.spacing.sp11 * 10 }} // 280px height
                  getItemType={() => 'city'}
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
