import { GradientHeading } from '@/components/text/gradientText';
import { UserProfile } from '@/components/userProfile/userProfile';
import { MutateFrienship } from '@/models/Friendship';
import { IGetBasicUserProfile } from '@/models/User';
import { useQueryGetFriendshipByTargetUserID } from '@/queries/currentUser/friendshipHooks';
import { useInfiniteQueryGetLikedEventsForBucketListByTargerUser, useInfiniteQueryGetSameMatchedEventsByTwoUsers } from '@/queries/targetUser/eventHooks';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { useStyles } from 'react-native-unistyles';


export default function TargetUserProfileScreen(): ReactNode {
  const { theme } = useStyles();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  console.log(uuid);
  const { data: friendshipData } = useQueryGetFriendshipByTargetUserID(uuid ?? '');
  const { data: targetUserProfile, isSuccess, isLoading } = useQueryGetTargetUserPeopleProfile(uuid);
  const { data: matchedEvents } = useInfiniteQueryGetSameMatchedEventsByTwoUsers(uuid);
  const { data: targetUserbucketList } = useInfiniteQueryGetLikedEventsForBucketListByTargerUser(targetUserProfile?.id);
  const hasIncommingFriendship: boolean = targetUserProfile?.hasIncommingFriendship ?? false;
  const hasOutgoingFriendship: boolean = targetUserProfile?.hasOutgoingFriendship ?? false;

  const [targetUserAsNewFriend, setTargetUserAsNewFriend] = useState({} as IGetBasicUserProfile);
  const [newFriendShip, setNewFriendShip] = useState<MutateFrienship | null>(null);
  const [toggleModal, setToggleModal] = useState(false);

  return (
    <>
      <SystemBars style='dark' />
      <Stack.Screen
        options={{
          headerShown: true,
          animation: 'slide_from_bottom',
          // presentation: 'modal',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              {targetUserProfile?.username}
            </GradientHeading>
          ),
        }}
      />
      <UserProfile
        isTargetUser={true}
        onBucketListEndReached={() => { }}
        userBucketList={targetUserbucketList}
        userProfile={targetUserProfile}
      />
    </>
  );
}
