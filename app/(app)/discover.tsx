import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';


export default function DiscoverScreen(): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Discover</Text>
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
