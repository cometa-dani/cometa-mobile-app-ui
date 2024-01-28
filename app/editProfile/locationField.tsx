import { StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from '../../components/Themed';
import { Stack } from 'expo-router';
import { animationDuration } from '../../constants/vars';


export function LocationFieldScreen(): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          presentation: 'fullScreenModal',
          headerTitleAlign: 'center',
          headerTitle: () => <TextInput value='location' />,
          headerShadowVisible: true,
          animationDuration: animationDuration,
          // headerStyle: {
          //   borderBottomColor: 'gray', // Set the color of the border
          // },
        }}
      />

      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Edit Profile Options</Text>
          <Text>location</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
