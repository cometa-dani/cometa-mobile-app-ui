import { FC, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../../components/Themed';
import * as Yup from 'yup';
import { profileStyles } from '../../components/profile/profileStyles';
import { useQueryGetTargetUserPeopleProfileByUid } from '../../queries/targetUser/userProfileHooks';
import { useInfiniteQueryGetLikedEventsForBucketListByTargerUser, useInfiniteQueryGetSameMatchedEventsByTwoUsers } from '../../queries/targetUser/eventHooks';
import { AppButton, appButtonstyles } from '../../components/buttons/buttons';
import { AppCarousel } from '../../components/carousels/carousel';
import { useCometaStore } from '../../store/cometaStore';
import { useMutationAcceptFriendshipInvitation, useMutationCancelFriendshipInvitation, useMutationResetFrienshipInvitation, useMutationSentFriendshipInvitation } from '../../queries/loggedInUser/friendshipHooks';
import { GetDetailedUserProfile, GetTargetUser } from '../../models/User';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../queries/queryKeys';
import { ProfileCarousel } from '../../components/profile/profileCarousel';
import { Badges } from '../../components/profile/badges';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FontAwesome } from '@expo/vector-icons';
import { If } from '../../components/utils';
import { ProfileTitle } from '../../components/profile/profileTitle';
import ReactNativeModal from 'react-native-modal';
import { gray_100, pink_200 } from '../../constants/colors';


const searchParamsSchemma = Yup.object({
  uuid: Yup.string().required(),
  eventId: Yup.string().optional()
});


export default function TargerUserProfileScreen(): JSX.Element {
  // client state
  const setToggleModal = useCometaStore(state => state.setToggleModal);
  const setTargetUserAsFriendshipSender = useCometaStore(state => state.setIncommginFriendshipSender);

  // colors
  const { background } = useColors();

  // url params
  const urlParams = useLocalSearchParams();
  const targetUserUrlParams = searchParamsSchemma.validateSync(urlParams);

  // queries
  const queryClient = useQueryClient();
  const { data: targetUserProfile, isSuccess, isLoading } = useQueryGetTargetUserPeopleProfileByUid(targetUserUrlParams.uuid);
  const { data: matchedEvents } = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUserUrlParams.uuid);
  const { data: targetUserbucketList } = useInfiniteQueryGetLikedEventsForBucketListByTargerUser(targetUserProfile?.id);


  const memoizedMatchedEvents = useMemo(() => (matchedEvents?.pages.flatMap(
    page => page.events.map(
      event => ({
        id: event.id,
        img: event.photos[0]?.url,
        placeholder: event.photos[0]?.placeholder
      })
    ))
    || []), [matchedEvents?.pages]);


  const memoizedBucketList = useMemo(() => (
    targetUserUrlParams?.eventId ?
      targetUserbucketList?.pages.flatMap(
        page => page.events.map(
          event => ({
            id: event.id,
            img: event?.photos[0]?.url ?? '',
            placeholder: event?.photos[0]?.placeholder ?? ''
          })
        )
      )
        .filter(event => event?.id !== +(targetUserUrlParams?.eventId ?? -1))
      :
      targetUserbucketList?.pages.flatMap(
        page => page.events.map(
          event => ({
            id: event.id,
            img: event?.photos[0]?.url ?? '',
            placeholder: event?.photos[0]?.placeholder ?? ''
          })
        )
      )), [targetUserbucketList?.pages, targetUserUrlParams.eventId]);


  const isTargetUserFriendShipReceiver: boolean = targetUserProfile?.incomingFriendships[0]?.status === 'PENDING';
  const isTargetUserFriendShipSender: boolean = targetUserProfile?.outgoingFriendships[0]?.status === 'PENDING';

  // mutations
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationResetFrienship = useMutationResetFrienshipInvitation();
  const mutationCancelFriendship = useMutationCancelFriendshipInvitation();

  /**
  *
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  * @param {GetBasicUserProfile} targetUserAsSender the sender of the friendship invitation
  */
  const acceptPendingInvitation = (targetUserAsSender: GetTargetUser): void => {
    setTargetUserAsFriendshipSender(targetUserAsSender);
    const friendshipID = targetUserAsSender.outgoingFriendships[0].id;
    if (!friendshipID) return;
    setTimeout(() => setToggleModal(), 200);
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
  const sentFriendshipInvitation = (targetUserAsReceiver: GetDetailedUserProfile): void => {
    mutationSentFriendship.mutate({ targetUserId: targetUserAsReceiver.id }, {
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
  const cancelFriendshipInvitation = (targetUserAsReceiver: GetDetailedUserProfile): void => {
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

  const [toggleModalUnfollow, setToggleModalUnfollow] = useState(false);

  const handleUnfollowingUser = (): void => {
    setToggleModalUnfollow(false);
    if (targetUserProfile?.isFriend) {
      const friendship = targetUserProfile?.incomingFriendships.at(0) ?? targetUserProfile?.outgoingFriendships.at(0);
      if (friendship) {
        mutationResetFrienship.mutate(friendship?.id, {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, targetUserUrlParams.eventId] });
          },
        });
        queryClient.setQueryData<GetTargetUser>(
          [QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserUrlParams.uuid],
          (oldData) => ({
            ...oldData,
            isFriend: !oldData?.isFriend
          }) as GetTargetUser
        );
        router.back();
      }
    }
  };


  const TargetUserFriendShipInvitationButtons: FC = () => (
    isSuccess && (
      targetUserProfile?.isFriend ? (
        <>
          <ReactNativeModal
            isVisible={toggleModalUnfollow}
            onBackdropPress={() => setToggleModalUnfollow(false)}
          >
            <View style={styles.modalContainer}>
              <View style={{ gap: 22 }}>
                <View>
                  <Text style={{ textAlign: 'center' }}>Are you sure you want to unfollow this profile?</Text>
                  {/* <Text >No events liked yet</Text> */}
                </View>

                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <Pressable
                    style={{ ...appButtonstyles.button, flex: 1, backgroundColor: gray_100 }}
                    onPress={() => {
                      setToggleModalUnfollow(false);
                    }} >
                    <Text style={{ ...appButtonstyles.buttonText }}>
                      CANCEL
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{ ...appButtonstyles.button, flex: 1, backgroundColor: pink_200 }}
                    onPress={handleUnfollowingUser}>
                    <Text style={{ ...appButtonstyles.buttonText }}>
                      UNFOLLOW
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ReactNativeModal>
          <View style={{ flexDirection: 'row', gap: 16, width: '100%', justifyContent: 'space-between' }}>
            <AppButton
              style={{ flex: 1 }}
              onPress={() => setToggleModalUnfollow(true)}
              btnColor='gray'
              text='FOLLOWING'
            />
            <AppButton
              style={{ flex: 1 }}
              onPress={() => router.push(`/chat/${targetUserProfile?.uid}`)}
              btnColor='pink'
              text='CHAT'
            />
          </View>
        </>
      ) : (
        <>
          {isTargetUserFriendShipReceiver && (
            <AppButton
              onPress={() => cancelFriendshipInvitation(targetUserProfile)}
              text="PENDING"
              btnColor='blue'
            />
          )}
          {isTargetUserFriendShipSender && (
            <AppButton
              onPress={() => acceptPendingInvitation(targetUserProfile)}
              text={'FOLLOW'}
              btnColor='black'
            />
          )}
          {!isTargetUserFriendShipReceiver && !isTargetUserFriendShipSender && (
            <AppButton
              onPress={() => sentFriendshipInvitation(targetUserProfile)}
              text="FOLLOW"
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
      isLocked={!targetUserProfile?.isFriend}
      title='BucketList'
      list={memoizedBucketList ?? []}
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


const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 180,
    width: 300,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    alignSelf: 'center'
  }
});
