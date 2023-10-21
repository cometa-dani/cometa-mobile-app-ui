import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';


export default function HomeScreen(): JSX.Element {
  const { data } = useCometaStore(state => state.events);
  const fetchEvents = useCometaStore(state => state.fetchEvents);

  useEffect(() => {
    fetchEvents().then();
  }, []);

  useEffect(() => {
    console.log(`data: ${JSON.stringify(data)}`);
  }, [data]);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Cometa Dani App</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
