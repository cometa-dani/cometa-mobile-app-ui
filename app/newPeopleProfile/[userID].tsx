import { StyleSheet, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../../components/Themed';


export default function NewPeopleProfileScreen(): JSX.Element {
  const userID = useLocalSearchParams()['userID'];
  const { background } = useColors();
  console.log(userID);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTitle: '@people',
          headerTitleAlign: 'center'
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: background }}
      >
        <View style={styles.container}>
          <Text>My People</Text>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
});
