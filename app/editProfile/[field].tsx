import { StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { animationDuration } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQueryGetCities } from '../../queries/citiesHooks';
import { gray_50 } from '../../constants/colors';


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
    }, 5_000);

    return () => clearTimeout(timeOutId);
  }, [inputValue]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          presentation: 'fullScreenModal',
          headerTitleAlign: 'left',
          // title: userProfileField || '',
          headerTitle: () => (
            <TextInput
              placeholder='Find your current city'
              value={inputValue}
              onChangeText={handleTextChange}
            />
          ),
          headerRight: () => (
            inputValue.length ?
              <FontAwesome name='close' size={20} />
              :
              null
          ),
          // headerShadowVisible: false,
          animationDuration: animationDuration,
        }}
      />
      {/* <View style={{ flex: 1 }}> */}
      <FlashList
        estimatedItemSize={50}
        data={citiesData}
        onEndReached={handleInfiniteFetch}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: gray_50 }} />}
        renderItem={({ item }) => (
          <View key={item.id} style={{ height: 50 }}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
      {/* </View> */}
    </SafeAreaView>
  );
}
