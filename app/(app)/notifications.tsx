import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { StatusBar } from 'expo-status-bar';


export default function NotificationsScreen(): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Notifications</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
