import { FC, useMemo } from 'react';
import { SafeAreaView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../../components/Themed';
import * as Yup from 'yup';
import { profileStyles } from '../../components/profile/profileStyles';
import { useQueryGetTargetUserPeopleProfileByUid } from '../../queries/targetUser/userProfileHooks';
import { useInfiniteQueryGetSameMatchedEventsByTwoUsers } from '../../queries/targetUser/eventHooks';
import { AppButton } from '../../components/buttons/buttons';
import { AppCarousel } from '../../components/carousels/carousel';
import { nodeEnv } from '../../constants/vars';
import { useCometaStore } from '../../store/cometaStore';
import { useMutationAcceptFriendshipInvitation, useMutationCancelFriendshipInvitation, useMutationSentFriendshipInvitation } from '../../queries/loggedInUser/friendshipHooks';
import { GetDetailedUserProfile } from '../../models/User';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../queries/queryKeys';
import { ProfileCarousel } from '../../components/profile/profileCarousel';
import { Badges } from '../../components/profile/badges';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FontAwesome } from '@expo/vector-icons';
import { If } from '../../components/utils';
import { ProfileTitle } from '../../components/profile/profileTitle';


const searchParamsSchemma = Yup.object({
  isFriend:
    Yup.boolean()
      .required()
      .transform((originalValue): boolean => {
        // Coerce string to number if it's a parsable number
        if (typeof originalValue === 'string') {
          return JSON.parse(originalValue); // boolean
        }
        // Otherwise, leave it as is
        return originalValue;
      }),

  uuid: Yup.string().required(),
  eventId: Yup.string().required()
});


export default function TargerUserProfileScreen(): JSX.Element {
  // client state
  const setToggleModal = useCometaStore(state => state.setToggleModal);
  const setTargetUserAsIncommginFriendshipSender = useCometaStore(state => state.setIncommginFriendshipSender);

  // colors
  const { background } = useColors();

  // url params
  const urlParams = useLocalSearchParams();
  const targetUserUrlParams = searchParamsSchemma.validateSync(urlParams);

  // queries
  const { data: targetUserProfile, isSuccess, isLoading } = useQueryGetTargetUserPeopleProfileByUid(targetUserUrlParams.uuid);
  const { data: matchedEvents } = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUserUrlParams.uuid);

  const memoizedMatchedEvents =
    useMemo(() => (matchedEvents?.pages.flatMap(
      page => page.events.map(
        event => ({
          id: event.id,
          img: event.photos[0]?.url,
          placeholder: event.photos[0]?.placeholder
        })
      ))
      || []), [matchedEvents?.pages]);

  const memoizedLikedEvents = useMemo(() => (
    targetUserProfile?.likedEvents
      .map(
        (likedEvent) => ({
          id: likedEvent.id,
          img: likedEvent.event.photos[0]?.url,
          placeholder: likedEvent.event.photos[0]?.placeholder
        }))
      .filter(event => event.id !== +targetUserUrlParams?.eventId)
    ||
    []
  ), [targetUserProfile?.likedEvents, targetUserUrlParams?.eventId]);


  const isTargetUserFriendShipReceiver: boolean = targetUserProfile?.incomingFriendships[0]?.status === 'PENDING';
  const isTargetUserFriendShipSender: boolean = targetUserProfile?.outgoingFriendships[0]?.status === 'PENDING';

  // mutations
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationCancelFriendship = useMutationCancelFriendshipInvitation();
  const queryClient = useQueryClient();

  /**
  *
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  * @param {GetBasicUserProfile} targetUserAsSender the sender of the friendship invitation
  */
  const handleLoggedInUserHasAPendingInvitation = (targetUserAsSender: GetDetailedUserProfile): void => {
    setTargetUserAsIncommginFriendshipSender(targetUserAsSender);
    setTimeout(() => setToggleModal(), 100);
    const friendshipID = targetUserAsSender.outgoingFriendships[0].id;
    mutationAcceptFriendship.mutate(friendshipID, {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE] });
      },
    });
  };

  /**
  *
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const handleLoggedInUserHasNoPendingInvitations = (targetUserAsReceiver: GetDetailedUserProfile): void => {
    mutationSentFriendship.mutate(targetUserAsReceiver.id, {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE] });
      },
    });
  };

  /**
  *
  * @description cancels a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const handleLoggedInUserCancelFriendshipInvitation = (targetUserAsReceiver: GetDetailedUserProfile): void => {
    mutationCancelFriendship.mutate(targetUserAsReceiver.id, {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE] });
      },
    });
  };


  const TargetUserBiography: FC = () => (
    <If
      condition={!isLoading}
      elseRender={(
        <ContentLoader
          speed={1}
          width={150}
          height={12}
          viewBox={`0 0 ${150} ${12}`}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <Rect x="6" y="0" rx="6" ry="6" width="140" height="12" />
        </ContentLoader>
      )}
      render={(
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <FontAwesome size={16} name='user' />
          <Text style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            {targetUserProfile?.biography}
          </Text>
        </View>
      )}
    />
  );


  const TargetUserFriendShipInvitationButtons: FC = () => (
    isSuccess && (
      targetUserUrlParams.isFriend ? (
        <AppButton
          onPress={() => router.push(`/chat/${targetUserProfile?.id}`)}
          btnColor='gray'
          text='CHAT'
        />
      ) : (
        <>
          {isTargetUserFriendShipReceiver && (
            <AppButton
              onPress={() => handleLoggedInUserCancelFriendshipInvitation(targetUserProfile)}
              text="PENDING"
              btnColor='blue'
            />
          )}
          {isTargetUserFriendShipSender && (
            <AppButton
              onPress={() => handleLoggedInUserHasAPendingInvitation(targetUserProfile)}
              text={nodeEnv === 'development' ? 'JOIN 2' : 'JOIN'}
              btnColor='black'
            />
          )}
          {!isTargetUserFriendShipReceiver && !isTargetUserFriendShipSender && (
            <AppButton
              onPress={() => handleLoggedInUserHasNoPendingInvitations(targetUserProfile)}
              text="JOIN"
              btnColor='black'
            />
          )}
        </>
      )
    )
  );


  const CarouselMatchedEventsByLoggedInUserAndTargetUser: FC = () => (
    <AppCarousel
      onPress={(initialScrollIndex: number) => router.push(`/targetUserProfile/matchedEventsList/${targetUserUrlParams.uuid}?initialScrollIndex=${initialScrollIndex}`)}
      title='Matches'
      list={memoizedMatchedEvents}
    />
  );

  // to block set to !isFriend
  const CarouselTargetUserBucketList: FC = () => (
    <AppCarousel
      onPress={(initialScrollIndex: number) => router.push(`/targetUserProfile/bucketList/${targetUserUrlParams.uuid}?eventId=${targetUserUrlParams.eventId}&initialScrollIndex=${initialScrollIndex}`)}
      isLocked={!targetUserUrlParams.isFriend}
      title='BucketList'
      list={memoizedLikedEvents}
    />
  );


  const TargetUserLanguages: FC = () => (
    <Badges
      iconName='comment'
      title='Languages'
      items={targetUserProfile?.languages ?? []}
    />
  );


  const TargetUserLocations: FC = () => (
    <Badges
      iconName='map-marker'
      title='Location'
      items={[`from ${targetUserProfile?.homeTown}`, `live in ${targetUserProfile?.currentLocation}`]}
    />
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'default',
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: targetUserProfile?.username || '',
          headerTitleAlign: 'center'
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: background }}
      >
        <ProfileCarousel
          isLoading={isLoading}
          userPhotos={targetUserProfile?.photos || []}
        />

        <View style={profileStyles.container}>

          <ProfileTitle
            isLoading={isLoading}
            userProfile={targetUserProfile}
          />

          <TargetUserBiography />

          <TargetUserFriendShipInvitationButtons />

          <CarouselMatchedEventsByLoggedInUserAndTargetUser />

          <CarouselTargetUserBucketList />

          <If condition={targetUserProfile?.languages?.length}
            render={
              <TargetUserLanguages />
            }
          />

          <If condition={targetUserProfile?.homeTown && targetUserProfile?.currentLocation}
            render={
              <TargetUserLocations />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}
