import { GradientHeading } from '@/components/text/gradientText';
import { TargetUserProfile } from '@/components/userProfile/targetUserProfile';
import { UserProfile } from '@/components/userProfile/userProfile';
import { MutateFrienship } from '@/models/Friendship';
import { IGetBasicUserProfile } from '@/models/User';
import { useQueryGetFriendshipByTargetUserID } from '@/queries/currentUser/friendshipHooks';
import { useInfiniteQueryGetTargetUserBucketList, useInfiniteQueryGetSameMatchedEventsByTwoUsers } from '@/queries/targetUser/eventHooks';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { useStyles } from 'react-native-unistyles';


export default function TargetUserProfileScreen(): ReactNode {
  const { theme } = useStyles();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  // const { data: friendshipData } = useQueryGetFriendshipByTargetUserID(uuid ?? '');
  const targetUserProfile = useQueryGetTargetUserPeopleProfile(uuid);
  const { data: matchedEvents } = useInfiniteQueryGetSameMatchedEventsByTwoUsers(uuid);
  const targetUserbucketList = useInfiniteQueryGetTargetUserBucketList(targetUserProfile?.data?.id);
  const hasIncommingFriendship: boolean = targetUserProfile?.data?.hasIncommingFriendship ?? false;
  const hasOutgoingFriendship: boolean = targetUserProfile?.data?.hasOutgoingFriendship ?? false;
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
          headerTitleAlign: 'center',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              {targetUserProfile?.data?.username}
            </GradientHeading>
          ),
        }}
      />
      <TargetUserProfile
        matches={matchedEvents}
        isListLoading={!targetUserbucketList.isSuccess}
        isHeaderLoading={!targetUserProfile.isSuccess}
        userBucketList={targetUserbucketList?.data}
        userProfile={targetUserProfile?.data}
        onBucketListEndReached={() => { }}
      />
    </>
  );
}
