import { StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { BaseButton, ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { animationDuration } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetCities } from '../../queries/citiesHooks';
import { gray_50 } from '../../constants/colors';
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';


const FadingLoader = () => {
  return (
    <View>
      <FadingLoaderCard1 />
      <FadingLoaderCard2 />
      <FadingLoaderCard3 />
      <FadingLoaderCard4 />
      <FadingLoaderCard5 />
    </View>
  );
};

const FadingLoaderCard1 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#ababab"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard2 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#bfbfbf"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard3 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#dadada"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard4 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#ececec"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard5 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#f7f7f7"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};


export default function EditProfileOptionsScreen(): JSX.Element {
  const { background } = useColors();
  const userProfileField = useLocalSearchParams()['field'] as string;

  const [inputValue, setInputValue] = useState('');
  const [triggerFetch, setTriggerFetch] = useState('');
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useInfiniteQueryGetCities(triggerFetch);

  const citiesData = useMemo(() => data?.pages.flatMap(page => page.data) || [], [data?.pages]);

  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  // const placeholder= userProfileField === 'location' ? 'Find your current city'
  const handleTextChange = (text: string) => {
    setInputValue(text);
  };

  // controls the debounce of the input
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setTriggerFetch(inputValue);
    }, 1_400);

    return () => clearTimeout(timeOutId);
  }, [inputValue]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          presentation: 'fullScreenModal',
          headerTitleAlign: 'left',
          headerTitle: () => (
            <TextInput
              style={{ fontSize: 16 }}
              placeholder='Find your current city'
              value={inputValue}
              onChangeText={handleTextChange}
            />
          ),
          headerRight: () => (
            inputValue.length ?
              <BaseButton onPress={() => setInputValue('')}>
                <FontAwesome name='close' size={20} />
              </BaseButton>
              :
              null
          ),
          animationDuration: animationDuration,
        }}
      />
      {isLoading ?
        <FadingLoader />
        :
        <FlashList
          estimatedItemSize={50}
          data={citiesData}
          onEndReached={handleInfiniteFetch}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 14 }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: gray_50 }} />}
          renderItem={({ item }) => (
            <View key={item.id} style={cityStyles.city}>
              <View>
                <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                <Text>{item.country}</Text>
              </View>
              <Text>{item.countryCode}</Text>
            </View>
          )}
        />
      }
    </SafeAreaView>
  );
}

const cityStyles = StyleSheet.create({
  city: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingVertical: 24
  }
});
