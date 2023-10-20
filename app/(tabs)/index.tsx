import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';
import eventsService from '../../services/eventsService';


export default function TabOneScreen() {
  const { data, error, isLoading } = useCometaStore(state => state.events);
  const fetchEvents = useCometaStore(state => state.fetchEvents);


  useEffect(() => {
    // setEvents().then();
    eventsService
      .getEvents()
      .then(({ data }) => console.log(`data: ${JSON.stringify(data)}`))
      .catch(err => console.log(`error: ${err.message}`));
  });

  // useEffect(() => {
  //   console.log(`data: ${JSON.stringify(data)}`);
  // }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cometa App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
