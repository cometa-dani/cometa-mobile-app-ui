import { GradientHeading } from '@/components/text/gradientText';
import { useInfiniteQueryGetBucketListScreen } from '@/queries/currentUser/eventHooks';
import { useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useStyles } from 'react-native-unistyles';
import { Feather, Octicons } from '@expo/vector-icons';
import { UserProfile } from '@/components/userProfile/userProfile';
import { Condition } from '@/components/utils/ifElse';
import { UserNameSkeleton } from '@/components/userProfile/components/headerUser';


export default function UserProfileScreen() {
  const { theme } = useStyles();
  const router = useRouter();
  const { data: userProfile, isSuccess: isUserProfileSuccess } = useQueryGetUserProfile();
  const {
    data: userBucketList,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isSuccess: isBucketListSuccess
  } = useInfiniteQueryGetBucketListScreen();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();

  return (
    <>
      <SystemBars style='dark' />
      <Tabs.Screen
        options={{
          headerLeft() {
            return (
              <TouchableOpacity
                onPress={() => router.push('/(userStacks)/settings')}
                style={{ marginLeft: theme.spacing.sp6 }}
              >
                <Octicons size={theme.spacing.sp10} name='gear' color={theme.colors.gray400} />
              </TouchableOpacity>
            );
          },
          headerRight() {
            return (
              <TouchableOpacity
                onPress={() => router.push('/(userStacks)/editUserProfile')}
                style={{ marginRight: theme.spacing.sp6 }}
              >
                <Feather size={theme.spacing.sp10} name='edit' color={theme.colors.gray400} />
              </TouchableOpacity >
            );
          },
          headerTitle: () => (
            <Condition
              if={!isUserProfileSuccess}
              then={<UserNameSkeleton />}
              else={
                <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
                  {userProfile?.username}
                </GradientHeading>
              }
            />
          ),
        }}
      />
      <UserProfile
        profile={userProfile}
        isHeaderLoading={!isUserProfileSuccess}
        bucketList={userBucketList}
        isListLoading={!isBucketListSuccess}
        onBucketListEndReached={handleInfiniteFetch}
      />
    </>
  );
}
