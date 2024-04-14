import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';


export default function SearchScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const uuid = useLocalSearchParams<{ uuid: string }>()['uuid'];


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>

      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: 'Search',
          headerTitleAlign: 'center'
        }}
      />
      <View style={styles.container}>

        <Text>Search {uuid}</Text>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
