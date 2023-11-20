import { StyleSheet, SafeAreaView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../../components/Themed';
import * as Yup from 'yup';
import { profileStyles } from '../../components/profile/profileStyles';
import { useQueryGetNewPeopleProfileByUid } from '../../queries/userHooks';
import { useQueryGetMatchedEvents } from '../../queries/eventHooks';
import { AppProfileAvatar } from '../../components/profile/profileAvatar';
import { AppButton } from '../../components/buttons/buttons';
import { AppStats } from '../../components/stats/Stats';
import { AppCarousel } from '../../components/carousels/carousel';
import { AppPhotosGrid } from '../../components/profile/photosGrid';
import { AppCard } from '../../components/card/card';
import { nodeEnv } from '../../constants/vars';


const searchParamsSchemma = Yup.object({
  isFriend: Yup.boolean().required().transform((originalValue, originalObject) => {
    // Coerce string to number if it's a parsable number
    if (typeof originalValue === 'string') {
      return JSON.parse(originalValue); // boolean
    }
    // Otherwise, leave it as is
    return originalValue;
  }),
  uuid: Yup.string().required(),
});


export default function NewPeopleProfileScreen(): JSX.Element {
  const { background } = useColors();
  // url params
  const urlParams = useLocalSearchParams();
  const { isFriend, uuid } = searchParamsSchemma.validateSync(urlParams);
  // queries
  const { data: newPeopleProfile } = useQueryGetNewPeopleProfileByUid(uuid);
  const { data: matchedEvents } = useQueryGetMatchedEvents(uuid);
  const isReceiver: boolean = newPeopleProfile?.incomingFriendships[0]?.status === 'PENDING';
  const isSender: boolean = newPeopleProfile?.outgoingFriendships[0]?.status === 'PENDING';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'default',
          headerShown: true,
          headerTitle: '@new_people',
          headerTitleAlign: 'center'
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: background }}
      >
        <View style={profileStyles.container}>
          <AppProfileAvatar
            avatar={newPeopleProfile?.avatar}
            name={newPeopleProfile?.username || ''}
            description={newPeopleProfile?.description || 'Hi there, let\'s meet '}
          />

          {/* ACTION BUTTONS */}
          {isFriend ? (
            <AppButton
              onPress={() => router.push(`/chat/${newPeopleProfile?.id}`)}
              btnColor='gray'
              text='CHAT'
            />
          ) : (
            <>
              {isReceiver && (
                <AppButton
                  // onPress={() => handleCancelFriendshipInvitation(anotherUser)}
                  text="PENDING"
                  btnColor='blue'
                />
              )}
              {isSender && (
                <AppButton
                  // onPress={() => handleCurrentUserHasAPendingInvitation(anotherUser)}
                  text={nodeEnv === 'development' ? 'JOIN 2' : 'JOIN'}
                  btnColor='black'
                />
              )}
              {!isReceiver && !isSender && (
                <AppButton
                  // onPress={() => handleCurrentUserHasNoPendingInvitations(anotherUser)}
                  text="JOIN"
                  btnColor='black'
                />
              )}
            </>
          )}
          {/* ACTION BUTTONS */}

          {/* STATISTICS */}
          <AppStats
            totalEvents={newPeopleProfile?._count?.likedEvents || 0}
            totalFriends={
              (newPeopleProfile?._count?.incomingFriendships || 0)
              +
              (newPeopleProfile?._count?.outgoingFriendships || 0)
            }
          />
          {/* STATISTICS */}

          {/* MATCHES */}
          <AppCarousel
            title='Matches'
            list={matchedEvents?.map(
              ({ event }) => ({ id: event.id, img: event.mediaUrl })) || []
            }
          />
          {/* MATCHES */}

          {/* BUCKETLIST */}
          <AppCarousel
            isLocked={!isFriend}
            title='BucketList'
            list={newPeopleProfile?.likedEvents.map(
              (likedEvent) => ({ id: likedEvent.id, img: likedEvent.event.mediaUrl })) || []
            }
          />
          {/* BUCKETLIST */}

          {/* PHOTOS */}
          <AppCard>
            <View style={profileStyles.cardWrapper}>
              <Text style={{ fontSize: 17, fontWeight: '700' }}>Photos</Text>
              <AppPhotosGrid
                photosList={newPeopleProfile?.photos || []}
              />
            </View>
          </AppCard>
          {/* PHOTOS */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // container: {
  //   flex: 1,
  //   gap: 24,
  //   paddingHorizontal: 20,
  //   paddingVertical: 30
  // },
});
