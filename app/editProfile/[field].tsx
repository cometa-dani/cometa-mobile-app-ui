import { StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { animationDuration } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';


export default function EditProfileOptionsScreen(): JSX.Element {
  const { background } = useColors();
  const userProfileField = useLocalSearchParams()['field'] as string;

  const [value, setValue] = useState('Useless Placeholder');

  // const placeholder= userProfileField === 'location' ? 'Find your current city'

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
              value={value}
              onChangeText={setValue}
            />
          ),
          headerRight: () => (
            value.length > 0 &&
            <FontAwesome name='close' size={20} />
          ),
          // headerShadowVisible: false,
          animationDuration: animationDuration,
        }}
      />
      {/* <View style={{ flex: 1 }}> */}
      <FlashList
        estimatedItemSize={20}
        data={['one', 'two', 'three']}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      {/* </View> */}
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
