import { TextInput, Pressable, View } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { animationDuration } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetCities } from '../../queries/currentUser/editProfileHooks';
import { gray_50 } from '../../constants/colors';
import { If } from '../../legacy_components/utils/ifElse';
import { FadingLoader } from '../../legacy_components/lodingSkeletons/FadingList';
import { TextView } from '@/components/text/text';
import { Heading } from '@/components/text/heading';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


interface IProps {
  placeholder: 'homeTown' | 'currentLocation';
  onSaveCity: (city: string) => void;
}
export function SearchCityByName({ placeholder, onSaveCity }: IProps): ReactNode {
  const { styles: cityStyles } = useStyles(styleSheet);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [triggerFetch, setTriggerFetch] = useState('');
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetCities(triggerFetch);
  const citiesData = data?.pages.flatMap(page => page.items) ?? [];
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  // controls the debounce of the input
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setTriggerFetch(inputValue);
    }, 1_400);

    return () => clearTimeout(timeOutId);
  }, [inputValue]);

  // focus the input when the data is fetched
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);

    return () => clearTimeout(timeout);
  }, [data]);


  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: 'left',
          headerTitle: () => (
            <TextInput
              style={{ fontSize: 16, fontFamily: 'Poppins' }}
              placeholder={placeholder}
              value={inputValue}
              onChangeText={setInputValue}
            />
          ),
          headerRight: () => (
            <If condition={inputValue.length > 0}>
              <BaseButton onPress={() => setInputValue('')}>
                <FontAwesome name='close' size={20} />
              </BaseButton>
            </If>
          ),
          animationDuration: animationDuration,
        }}
      />

      <If
        condition={isLoading}
        render={<FadingLoader />}
        elseRender={(
          <FlashList
            estimatedItemSize={70}
            data={citiesData}
            onEndReached={handleInfiniteFetch}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 14 }}
            ItemSeparatorComponent={() => <View style={{ height: 0.6, backgroundColor: gray_50 }} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSaveCity(item.city)}
                key={item.id}
                style={cityStyles.city}
              >
                {({ pressed }) => (
                  <>
                    <View style={{ opacity: pressed ? 0.6 : 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TextView>{item.city}</TextView>
                        <FontAwesome name='flag-o' size={20} />
                      </View>
                      <Heading size='s4'>{item.country}</Heading>
                    </View>
                    <TextView style={{ opacity: pressed ? 0.6 : 1 }}>{item.country}</TextView>
                  </>
                )}
              </Pressable>
            )}
          />
        )}
      />
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  city: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    paddingVertical: 24
  }
}));
