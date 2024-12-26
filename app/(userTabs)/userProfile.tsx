import { GradientHeading } from '@/components/text/gradientText';
import { useInfiniteQueryGetBucketListScreen } from '@/queries/currentUser/eventHooks';
import { useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useStyles } from 'react-native-unistyles';
import { Feather, Octicons } from '@expo/vector-icons';
import { UserProfile } from '@/components/userProfile/userProfile';


export default function UserProfileScreen() {
  const { theme } = useStyles();
  const router = useRouter();
  const {
    data: userBucketList,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryGetBucketListScreen();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const { data: userProfile } = useQueryGetUserProfile();

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
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              {userProfile?.username}
            </GradientHeading>
          ),
        }}
      />
      <UserProfile
        userBucketList={userBucketList}
        userProfile={userProfile}
        onBucketListEndReached={handleInfiniteFetch}
      />
    </>
  );
}
