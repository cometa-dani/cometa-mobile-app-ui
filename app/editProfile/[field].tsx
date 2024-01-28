import { StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { animationDuration } from '../../constants/vars';


export default function EditProfileOptionsScreen(): JSX.Element {
  const userProfileField = useLocalSearchParams()['field'] as string;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          presentation: 'fullScreenModal',
          headerTitleAlign: 'center',
          title: userProfileField || '',
          headerShadowVisible: true,
          animationDuration: animationDuration
        }}
      />

      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Edit Profile Options</Text>
          <Text>{userProfileField}</Text>
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
