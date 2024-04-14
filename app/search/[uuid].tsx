import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';


export default function SearchScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const uuid = useLocalSearchParams<{ uuid: string }>()['uuid'];


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>

        <Text>Notifications {uuid}</Text>

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
