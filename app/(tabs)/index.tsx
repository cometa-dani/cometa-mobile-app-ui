import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';


export default function TabOneScreen() {
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
      <Text style={styles.title}>Cometa Dani App</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
