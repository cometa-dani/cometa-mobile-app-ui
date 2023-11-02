import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useQueryGetEventById, useInfiteQueryGetUsersWhoLikedEventByID } from '../queries/events/hooks';
import { Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';


export default function ConnectWithPeopleScreen(): JSX.Element {
  const urlParam = useLocalSearchParams()['connectWithPeople'];
  const { data: eventData } = useQueryGetEventById(+urlParam);
  const { data: usersWhoLikedSameEventData } = useInfiteQueryGetUsersWhoLikedEventByID(+urlParam);

  console.log(urlParam);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image style={styles.imgHeader} source={{ uri: eventData?.mediaUrl }} />
        </View>

        <View style={styles.tabs}>
          <Text style={styles.tab}>Friends</Text>
          <Text style={styles.tab}>New People</Text>
        </View>

        <FlatList
          contentContainerStyle={{ gap: 28, flex: 1, paddingHorizontal: 18, paddingVertical: 6 }}
          data={usersWhoLikedSameEventData?.pages.flatMap(users => users.usersWhoLikedEvent)}
          renderItem={({ item }) => {
            const hasIcommingFriendShip = item.user.incomingFriendships[0]?.status === 'PENDING';
            const hasSentInvitation = item.user.outgoingFriendships[0]?.status === 'PENDING';
            console.log(item.user);
            // console.log(item.user.outgoingFriendships[0]?.status);
            return (
              <View key={item.id} style={styles.user}>
                <Image style={styles.userAvatar} source={{ uri: item.user.avatar }} />
                <Text>{item.user.username}</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
    paddingVertical: 26
  },

  imgContainer: {
    paddingHorizontal: 18,
  },

  imgHeader: {
    borderRadius: 20,
    height: 180,
    width: 'auto',
  },

  tab: {
    fontSize: 20
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18
  },

  user: {
    alignItems: 'center',
    borderRadius: 40,
    elevation: 3,
    flexDirection: 'row',
    gap: 18,
    padding: 20,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },

  userAvatar: {
    aspectRatio: 1,
    borderRadius: 50,
    width: 30
  }
});
