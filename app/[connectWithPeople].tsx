import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEventByIdQuery, useInfiteUsersWhoLikedSameEventQuery } from '../queries/events/hooks';


export default function ConnectWithPeopleScreen(): JSX.Element {
  const urlParam = useLocalSearchParams()['connectWithPeople'];
  const { data: eventData } = useEventByIdQuery(+urlParam);
  const { data: usersWhoLikedSameEventData } = useInfiteUsersWhoLikedSameEventQuery(+urlParam);

  console.log('Local:', eventData, usersWhoLikedSameEventData);

  return (
    <>
      <StatusBar style={'auto'} />

      <View style={styles.container}>


        <Link href={'/chat'}>
          <Text style={styles.title}>Connect with like-minded People</Text>
        </Link>

      </View>
    </>
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
