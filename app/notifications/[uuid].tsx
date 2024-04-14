import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';


export default function NotificationsScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const uuid = useLocalSearchParams<{ uuid: string }>()['uuid'];


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            presentation: 'modal',
            animation: 'default',
            headerShown: true,
            headerShadowVisible: false,
            headerTitle: 'Notifications',
            headerTitleAlign: 'center'
          }}
        />
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
