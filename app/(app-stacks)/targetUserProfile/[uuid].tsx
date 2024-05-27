import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../../../components/Themed';
import * as Yup from 'yup';
import { profileStyles } from '../../../components/profile/profileStyles';
import { useQueryGetTargetUserPeopleProfileByUid } from '../../../queries/targetUser/userProfileHooks';
import { useInfiniteQueryGetLikedEventsForBucketListByTargerUser, useInfiniteQueryGetSameMatchedEventsByTwoUsers } from '../../../queries/targetUser/eventHooks';
import { AppButton, appButtonstyles } from '../../../components/buttons/buttons';
import { AppCarousel } from '../../../components/carousels/carousel';
import { useCometaStore } from '../../../store/cometaStore';
import { useMutationAcceptFriendshipInvitation, useMutationCancelFriendshipInvitation, useMutationSentFriendshipInvitation } from '../../../queries/loggedInUser/friendshipHooks';
import { GetBasicUserProfile, GetTargetUser } from '../../../models/User';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../../queries/queryKeys';
import { ProfileCarousel } from '../../../components/profile/profileCarousel';
import { Badges } from '../../../components/profile/badges';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FontAwesome } from '@expo/vector-icons';
import { If } from '../../../components/utils';
import { ProfileTitle } from '../../../components/profile/profileTitle';
import ReactNativeModal from 'react-native-modal';
import { gray_100, pink_200 } from '../../../constants/colors';
import { ErrorMessage } from '../../../queries/errors/errorMessages';
import notificationService from '../../../services/notificationService';
import { useQueryGetLoggedInUserProfileByUid } from '../../../queries/loggedInUser/userProfileHooks';
import { MutateFrienship } from '../../../models/Friendship';
import { ModalNewFriendship } from '../../../components/modal/modalNewFriendship';


const searchParamsSchemma = Yup.object({
  uuid: Yup.string().required(),
  eventId: Yup.number().optional()
});


export default function TargerUserProfileScreen(): JSX.Element {
  // client state
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const { data: loggedInUserProfile } = useQueryGetLoggedInUserProfileByUid(loggedInUserUuid);

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
  const hasIncommingFriendship: boolean = targetUserProfile?.hasIncommingFriendship ?? false;
  const hasOutgoingFriendship: boolean = targetUserProfile?.hasOutgoingFriendship ?? false;

  const [targetUserAsNewFriend, setTargetUserAsNewFriend] = useState({} as GetBasicUserProfile);
  const [newFriendShip, setNewFriendShip] = useState<MutateFrienship | null>(null);
  const [toggleModal, setToggleModal] = useState(false);

  // memoized data
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

  // mutations
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationCancelFriendship = useMutationCancelFriendshipInvitation();


  const pendingButton = {
    handleOptimisticUpdate: (targetUserID: string) => (
      queryClient
        .setQueryData<GetTargetUser>(
          [QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserID],
          (oldata) => ({
            ...oldata,
            hasIncommingFriendship: true
          } as GetTargetUser)
        )
    )
  };


  /**
  *
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  * @param {GetBasicUserProfile} targetUserAsSender the sender of the friendship invitation
  */
  const acceptPendingInvitation = async (targetUserAsSender: GetTargetUser) => {
    try {
      // 1. set button to pending
      if (!targetUserAsSender.hasOutgoingFriendship) {
        pendingButton.handleOptimisticUpdate(targetUserAsSender.uid);
      }
      setTargetUserAsNewFriend(targetUserAsSender);

      // 2. mutation
      const newCreatedFriendship =
        await mutationAcceptFriendship.mutateAsync(
          targetUserAsSender.id, {
          onSuccess: async () => {
            setToggleModal(true);
            if (urlParams.eventId) {
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId]
              });
            }
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserAsSender.uid]
              }),
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION]
              })
            ]);
          },
          onError: ({ response }) => {
            if (response?.data.message === ErrorMessage.INVITATION_DOES_NOT_EXIST) {
              sentFriendshipInvitation(targetUserAsSender);
            }
          }
        });
      if (!newCreatedFriendship) return;

      setNewFriendShip(newCreatedFriendship);
      const messagePayload = {
        createdAt: new Date().toString(),
        user: {
          _id: loggedInUserUuid,
          avatar: loggedInUserProfile?.photos[0]?.url,
          name: loggedInUserProfile?.username
        }
      };
      await
        notificationService.sentNotificationToTargetUser(
          messagePayload,
          targetUserAsSender.uid,
          newCreatedFriendship.chatuuid
        );
    }
    catch (error) {
      return null;
    }
  };

  /**
  *
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const sentFriendshipInvitation = (targetUserAsReceiver: GetTargetUser): void => {
    // 1. set button to pending
    pendingButton.handleOptimisticUpdate(targetUserAsReceiver.uid);

    // 2. mutation
    mutationSentFriendship.mutate(
      { targetUserId: targetUserAsReceiver.id },
      {
        onSuccess() {
          if (urlParams.eventId) {
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId]
            });
          }
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserAsReceiver.uid]
          });
        },
        onError: ({ response }) => {
          if (response?.data.message === ErrorMessage.INVITATION_ALREADY_PENDING) {
            acceptPendingInvitation(targetUserAsReceiver);
          }
        }
      }
    );
  };

  /**
  *
  * @description cancels a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const cancelFriendshipInvitation = (targetUserAsReceiver: GetTargetUser): void => {
    mutationCancelFriendship.mutate(targetUserAsReceiver.id, {
      onSuccess() {
        if (urlParams.eventId) {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId]
          });
        }
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserAsReceiver.uid] });
      },
    });
  };

  const [toggleModalUnfollow, setToggleModalUnfollow] = useState(false);

  const handleUnfollowingUser = (): void => {
    setToggleModalUnfollow(false);
    if (targetUserProfile?.isFriend) {
      mutationCancelFriendship.mutate(targetUserProfile.id, {
        onSuccess: async () => {
          if (urlParams.eventId) {
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId]
            });
          }
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserProfile.uid] }),
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION] })
          ]);
        },
      });
      queryClient.setQueryData<GetTargetUser>(
        [QueryKeys.GET_TARGET_USER_INFO_PROFILE, targetUserUrlParams.uuid],
        (oldData) => ({
          ...oldData,
          isFriend: !oldData?.isFriend
        }) as GetTargetUser
      );
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <ModalNewFriendship
        frienshipUUID={newFriendShip?.chatuuid ?? ''}
        loggedInUserProfile={loggedInUserProfile!}
        targetUser={targetUserAsNewFriend}
        onclose={() => setToggleModal(false)}
        toggle={toggleModal}
      />

      <Stack.Screen
        options={{
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
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

          {/* biography */}
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
          />{/* biography */}

          {/* friendship invitation buttons */}
          {isSuccess && (
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
                {hasIncommingFriendship && !hasOutgoingFriendship && (
                  <AppButton
                    onPress={() => cancelFriendshipInvitation(targetUserProfile)}
                    text="PENDING"
                    btnColor='blue'
                  />
                )}
                {hasOutgoingFriendship && !hasIncommingFriendship && (
                  <AppButton
                    onPress={() => acceptPendingInvitation(targetUserProfile)}
                    text={'FOLLOW'}
                    btnColor='black'
                  />
                )}
                {!hasIncommingFriendship && !hasOutgoingFriendship && (
                  <AppButton
                    onPress={() => sentFriendshipInvitation(targetUserProfile)}
                    text="FOLLOW"
                    btnColor='black'
                  />
                )}
              </>
            )
          )}
          {/* friendship invitation buttons */}

          <AppCarousel
            onPress={(initialScrollIndex: number) => router.push(`/targetUserProfile/matchedEventsList/${targetUserUrlParams.uuid}?initialScrollIndex=${initialScrollIndex}`)}
            title='Matches'
            list={memoizedMatchedEvents}
          />

          {/* to block set to !isFriend */}
          <AppCarousel
            onPress={(initialScrollIndex: number) => router.push(`/targetUserProfile/bucketList/${targetUserUrlParams.uuid}?eventId=${targetUserUrlParams.eventId}&initialScrollIndex=${initialScrollIndex}`)}
            isLocked={!targetUserProfile?.isFriend}
            title='BucketList'
            list={memoizedBucketList ?? []}
          />

          <If condition={targetUserProfile?.languages?.length}
            render={
              <Badges
                iconName='comment'
                title='Languages'
                items={targetUserProfile?.languages ?? []}
              />
            }
          />

          <If condition={targetUserProfile?.homeTown && targetUserProfile?.currentLocation}
            render={
              <Badges
                iconName='map-marker'
                title='Location'
                items={[`from ${targetUserProfile?.homeTown}`, `live in ${targetUserProfile?.currentLocation}`]}
              />
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
