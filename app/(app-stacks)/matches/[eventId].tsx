import React, { FC, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Pressable, Image as HeaderImage } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { Stack, router, useGlobalSearchParams } from 'expo-router';
import { useInfiteQueryGetUsersWhoLikedSameEventByID } from '../../../queries/targetUser/eventHooks';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppButton } from '../../../components/buttons/buttons';
import { useInfiniteQueryGetLoggedInUserNewestFriends, useMutationAcceptFriendshipInvitation, useMutationDeleteFriendshipInvitation, useMutationSentFriendshipInvitation } from '../../../queries/loggedInUser/friendshipHooks';
import { useCometaStore } from '../../../store/cometaStore';
import { GetBasicUserProfile, GetMatchedUsersWhoLikedEventWithPagination } from '../../../models/User';
import { animationDuration, defaultImgPlaceholder } from '../../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { gray_200, gray_300, gray_500 } from '../../../constants/colors';
import { useQueryGetLoggedInUserProfileByUid } from '../../../queries/loggedInUser/userProfileHooks';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../../../queries/queryKeys';
import { GetLikedEventsForBucketListWithPagination } from '../../../models/LikedEvent';
import { If } from '../../../components/utils';
import { GetLatestFriendships, MutateFrienship } from '../../../models/Friendship';
import notificationService from '../../../services/notificationService';
import { SkeletonLoaderList } from '../../../components/lodingSkeletons/LoadingSkeletonList';
import { ErrorMessage } from '../../../queries/errors/errorMessages';
import { ModalNewFriendship } from '../../../components/modal/modalNewFriendship';
import { titles } from '../../../constants/assets';


export default function MatchedEventsScreen(): JSX.Element {
  const urlParams = useGlobalSearchParams<{ eventId: string, eventIndex: string }>();
  // cached data
  const queryClient = useQueryClient();
  const bucketListCahedData = queryClient.getQueryData<InfiniteData<GetLikedEventsForBucketListWithPagination, number>>([QueryKeys.GET_LIKED_EVENTS_FOR_BUCKETLIST_WITH_PAGINATION]);
  const eventByIdCachedData = bucketListCahedData?.pages.flatMap(page => page?.items)[+urlParams.eventIndex] ?? null;

  // people state
  const newPeopleData = useInfiteQueryGetUsersWhoLikedSameEventByID(+urlParams.eventId);
  const newFriendsData = useInfiniteQueryGetLoggedInUserNewestFriends();


  const memoizedFriendsList = useMemo(() => (
    newFriendsData.data?.pages.flatMap(page => page?.friendships) ?? []
  ), [newFriendsData.data?.pages]);
  const memoizedNewPeopleList = useMemo(() => (
    newPeopleData.data?.pages.flatMap(page => page?.items) ?? []
  ), [newPeopleData.data?.pages]);


  const handleNewPeopleInfiniteScroll = (): void => {
    if (newPeopleData) {
      const { hasNextPage, isFetching, fetchNextPage } = newPeopleData;
      hasNextPage && !isFetching && fetchNextPage();
    }
  };
  const handleNewFriendsInfiniteScroll = (): void => {
    if (newFriendsData) {
      const { hasNextPage, isFetching, fetchNextPage } = newFriendsData;
      hasNextPage && !isFetching && fetchNextPage();
    }
  };

  // toggling tabs
  const [toggleTabs, setToggleTabs] = useState(false); // shuould be store on phone


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screenContainer}>
        <View style={[styles.header, { paddingHorizontal: 18, paddingTop: 20 }]}>
          {eventByIdCachedData?.photos[0]?.url &&
            <HeaderImage
              style={styles.imgHeader}
              source={{ uri: eventByIdCachedData?.photos[0]?.url }}
            />
          }

          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
              <Text size='lg' style={[styles.tab, toggleTabs && { ...styles.tabActive, color: '#83C9DD' }]}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
              <Text size='lg' style={[styles.tab, !toggleTabs && { ...styles.tabActive, color: '#E44063' }]}>New People</Text>
            </TouchableOpacity>
          </View>
        </View>

        <If
          condition={toggleTabs}
          render={(
            <FriendsFlashList
              onInfiniteScroll={handleNewFriendsInfiniteScroll}
              users={memoizedFriendsList}
              isFetching={newFriendsData.isPending}
              isEmpty={!newFriendsData.data?.pages[0]?.totalFriendships}
            />
          )}
          elseRender={(
            <MeetNewPeopleFlashList
              onInfiniteScroll={handleNewPeopleInfiniteScroll}
              users={memoizedNewPeopleList}
              isFetching={newPeopleData.isPending}
              isEmpty={!newPeopleData.data?.pages[0]?.totalItems}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}


interface FlashListProps {
  users: GetMatchedUsersWhoLikedEventWithPagination['items'];
  isFetching: boolean;
  isEmpty: boolean;
  onInfiniteScroll: () => void,
}

const MeetNewPeopleFlashList: FC<FlashListProps> = ({ isEmpty, isFetching, users, onInfiniteScroll }) => {
  const queryClient = useQueryClient();
  const loggedInUserUuid = useCometaStore(state => state.uid);
  const { data: loggedInUserProfile } = useQueryGetLoggedInUserProfileByUid(loggedInUserUuid);
  const urlParams = useGlobalSearchParams<{ eventId: string }>();
  const [targetUserAsNewFriend, setTargetUserAsNewFriend] = useState<GetBasicUserProfile | undefined>(undefined);
  const [newFriendShip, setNewFriendShip] = useState<MutateFrienship | null>(null);
  const [toggleModal, setToggleModal] = useState(false);

  // mutations
  const mutationSentFriendship = useMutationSentFriendshipInvitation();
  const mutationAcceptFriendship = useMutationAcceptFriendshipInvitation();
  const mutationCancelFriendship = useMutationDeleteFriendshipInvitation();

  /**
  *
  * @description from a sender user, accepts friendship with status 'ACCEPTED'
  */
  const acceptPendingInvitation = async (targetUserAsSender: GetBasicUserProfile) => {
    try {
      // 1. set button to pending
      if (!targetUserAsSender.hasOutgoingFriendship) {
        pendingButton.handleOptimisticUpdate(targetUserAsSender.id);
      }
      setTargetUserAsNewFriend(targetUserAsSender);

      // 2. mutation
      const newCreatedFrienship =
        await mutationAcceptFriendship.mutateAsync(
          targetUserAsSender.id,
          {
            onSuccess: async () => {
              setToggleModal(true);
              // refetch on screen focus
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId] }),
                queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NEWEST_FRIENDS_WITH_PAGINATION] })
              ]);
            },
            onError: ({ response }) => {
              if (response?.data.message === ErrorMessage.INVITATION_DOES_NOT_EXIST) {
                sentFriendshipInvitation(targetUserAsSender);
              }
            }
          }
        ); // set status to 'ACCEPTED' and create chat uuid
      if (!newCreatedFrienship) return;

      setNewFriendShip(newCreatedFrienship);
      const messagePayload = {
        createdAt: new Date().toString(),
        user: {
          _id: loggedInUserUuid,
          avatar: loggedInUserProfile?.photos[0]?.url,
          name: loggedInUserProfile?.username,
          message: `${loggedInUserProfile?.username} is your new match!`,
          isSeen: false
        }
      };
      await
        notificationService.sentNotificationToTargetUser(
          messagePayload,
          targetUserAsSender.uid, // to
          loggedInUserUuid // from
        )
          .then()
          .catch();
    }
    catch (error) {
      return null;
    }
  };


  const pendingButton = {
    /**
     *
     * @description sets the button to pending optimistically
     */
    handleOptimisticUpdate: (userID: number) => {
      queryClient.setQueryData<InfiniteData<GetMatchedUsersWhoLikedEventWithPagination>>(
        [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId],
        (oldData) => ({
          pageParams: oldData?.pageParams,
          pages:
            oldData?.pages
              .map((page) => ({
                ...page,
                items:
                  page.items
                    .map(event => event.userId === userID ?
                      ({
                        ...event,
                        user: {
                          ...event.user,
                          hasIncommingFriendship: true
                        }
                      })
                      : event
                    )
              }))

        }) as InfiniteData<GetMatchedUsersWhoLikedEventWithPagination>);
    }
  };


  /**
  *
  * @description for a receiver user, sends a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const sentFriendshipInvitation = (targetUserAsReceiver: GetBasicUserProfile): void => {
    // 1. set button to pending
    pendingButton.handleOptimisticUpdate(targetUserAsReceiver.id);

    // 2. mutation
    mutationSentFriendship.mutateAsync(
      { targetUserId: targetUserAsReceiver.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId]
          });
        },
        onError: ({ response }) => {
          if (response?.data.message === ErrorMessage.INVITATION_ALREADY_PENDING) {
            acceptPendingInvitation(targetUserAsReceiver);
          }
        }
      }
    )
      .then(() => {
        const messagePayload = {
          createdAt: new Date().toString(),
          user: {
            _id: loggedInUserUuid,
            avatar: loggedInUserProfile?.photos[0]?.url,
            name: loggedInUserProfile?.username,
            message: `${loggedInUserProfile?.username} has followed you!`,
            isSeen: false
          }
        };
        notificationService.sentNotificationToTargetUser(
          messagePayload,
          targetUserAsReceiver.uid, // to
          loggedInUserUuid   // from
        )
          .then()
          .catch();
      })
      .catch();
  };

  /**
  *
  * @description cancels a friendship invitation with status 'PENDING'
  * @param {GetBasicUserProfile} targetUserAsReceiver the receiver of the friendship invitation
  */
  const cancelFriendshipInvitation = (targetUserAsReceiver: GetBasicUserProfile): void => {
    mutationCancelFriendship.mutate(
      targetUserAsReceiver.id,
      {
        onSuccess() {
          notificationService
            .deleteNotification(targetUserAsReceiver.uid, loggedInUserUuid)
            .then()
            .catch();
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.GET_USERS_WHO_LIKED_SAME_EVENT_WITH_PAGINATION, +urlParams.eventId]
          });
        }
      }
    );
  };


  return (
    <>
      <Stack.Screen
        options={{
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitle: () => (
            <Image
              style={{ height: 24, width: 110 }}
              source={titles.matches}
            />
          ),
          animationDuration: animationDuration,
        }}
      />

      <ModalNewFriendship
        frienshipUUID={newFriendShip?.chatuuid ?? ''}
        loggedInUserProfile={loggedInUserProfile!}
        targetUser={targetUserAsNewFriend}
        onclose={() => setToggleModal(false)}
        toggle={toggleModal}
      />

      <If
        condition={isFetching}
        render={(
          <SkeletonLoaderList height={80} gap={26} />
        )}
        elseRender={(
          <If
            condition={isEmpty}
            render={(
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ ...styles.tab, color: gray_300 }}>No new people</Text>
              </View>
            )}
            elseRender={(
              <FlashList
                onEndReached={onInfiniteScroll}
                onEndReachedThreshold={0.4}
                decelerationRate={'normal'}
                estimatedItemSize={100}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                contentContainerStyle={styles.flatList}
                showsVerticalScrollIndicator={true}
                data={users}
                renderItem={({ item: { user: targetUser } }) => {
                  const { hasIncommingFriendship = false, hasOutgoingFriendship = false } = targetUser;
                  return (
                    <View key={targetUser.id} style={styles.user}>
                      <Pressable onPress={() => router.push(`/targetUserProfile/${targetUser.uid}?eventId=${urlParams.eventId}`)}>
                        <View style={styles.avatarContainer}>
                          <Image
                            style={styles.userAvatar}
                            placeholder={{ thumbhash: targetUser?.photos[0]?.placeholder }}
                            source={{ uri: targetUser?.photos[0]?.url ?? defaultImgPlaceholder }}
                          />

                          <View style={styles.textContainer}>
                            <Text
                              size='lg'
                              style={styles.userName}
                              numberOfLines={1}
                              ellipsizeMode='tail'
                            >
                              {targetUser.name}
                            </Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode='tail'
                            >
                              {targetUser.username}
                            </Text>
                          </View>
                        </View>
                      </Pressable>

                      {!hasIncommingFriendship && !hasOutgoingFriendship && (
                        <AppButton
                          onPress={() => sentFriendshipInvitation(targetUser)}
                          text="FOLLOW"
                          btnColor='black'
                        />
                      )}

                      {hasOutgoingFriendship && !hasIncommingFriendship && (
                        <AppButton
                          onPress={() => acceptPendingInvitation(targetUser)}
                          text='FOLLOW'
                          btnColor='black'
                        />
                      )}

                      {hasIncommingFriendship && !hasOutgoingFriendship && (
                        <AppButton
                          enabled={false}
                          onPress={() => cancelFriendshipInvitation(targetUser)}
                          text="PENDING"
                          style={{ opacity: 0.5 }}
                          btnColor='blue'
                        />
                      )}
                    </View>
                  );
                }}
              />
            )}
          />
        )}
      />
    </>
  );
};


// const MemoizedMeetNewPeopleFlashList = React.memo(MeetNewPeopleFlashList, (prev, curr) => {
//   return prev.users === curr.users && prev.isFetching === curr.isFetching;
// });


interface FriendsFlashListProps {
  users: GetLatestFriendships['friendships'];
  isFetching: boolean;
  isEmpty: boolean;
  onInfiniteScroll: () => void
}


const FriendsFlashList: FC<FriendsFlashListProps> = ({ users, isEmpty, isFetching, onInfiniteScroll }) => {
  const urlParams = useGlobalSearchParams<{ eventId: string, eventIndex: string }>();
  return (
    <If
      condition={isFetching}
      render={(
        <SkeletonLoaderList height={80} gap={26} />
      )}
      elseRender={(
        <If
          condition={isEmpty}
          render={(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ ...styles.tab, color: gray_300 }}>No friends</Text>
            </View>
          )}
          elseRender={(
            <FlashList
              onEndReached={onInfiniteScroll}
              onEndReachedThreshold={0.4}
              decelerationRate={'normal'}
              estimatedItemSize={100}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              contentContainerStyle={styles.flatList}
              showsVerticalScrollIndicator={true}
              data={users}
              renderItem={({ item }) => {
                return (
                  <View key={item?.friend?.id} style={styles.user}>
                    <Pressable onPress={() => router.push(`/targetUserProfile/${item?.friend?.uid}?eventId=${urlParams.eventId}&chatuuid=${item?.chatuuid}`)}>
                      <View style={styles.avatarContainer}>
                        <Image
                          style={styles.userAvatar}
                          placeholder={{ thumbhash: item?.friend?.photos[0]?.placeholder ?? '' }}
                          source={{ uri: item?.friend?.photos[0]?.url ?? '' }}
                        />

                        <View style={styles.textContainer}>
                          <Text
                            size='lg'
                            style={styles.userName}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                          >
                            {item?.friend?.name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode='tail'
                          >
                            {item?.friend?.username}
                          </Text>
                        </View>
                      </View>
                    </Pressable>

                    <AppButton
                      onPress={() => router.push(`/chat/${item?.friend?.uid}`)}
                      text="CHAT"
                      btnColor='gray'
                    />
                  </View>
                );
              }}
            />
          )}
        />
      )}
    />
  );
};


// const MemoizedFriendsFlashList = React.memo(FriendsFlashList, (prev, curr) => {
//   return prev.users === curr.users && prev.isFetching === curr.isFetching;
// });

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  flatList: {
    paddingHorizontal: 20,
    paddingVertical: 26
  },

  header: {
    gap: 16
  },

  imgHeader: {
    borderRadius: 20,
    objectFit: 'cover',
    height: 180,
    width: 'auto',
  },

  screenContainer: {
    flex: 1,
  },

  tab: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: gray_500
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: gray_200
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6
  },

  textContainer: {
    gap: -1,
    justifyContent: 'center'
  },

  user: {
    alignItems: 'center',
    borderRadius: 40,
    elevation: 3,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 22,
    paddingVertical: 18,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },

  userAvatar: {
    aspectRatio: 1,
    borderRadius: 50,
    width: 50
  },

  userName: {
    textTransform: 'capitalize',
    width: 110
  }
});
