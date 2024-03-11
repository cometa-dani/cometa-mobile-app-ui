import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { blue_100 } from '../../constants/colors';


export default function ChatAppScreen(): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Chat',
          headerTitleAlign: 'center',
          headerRight() {
            return (
              <TouchableOpacity style={{ marginRight: 24 }}>
                <FontAwesome size={28} color={blue_100} name='plus-circle' />
              </TouchableOpacity>
            );
          },
        }}
      />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Chat App</Text>
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
