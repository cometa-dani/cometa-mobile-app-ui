import {
  useInfiniteQueryGetSameMatchedEventsByTwoUsers,
  useInfiniteQueryGetTargetUserBucketList
} from '@/queries/targetUser/eventHooks';
import { useCallback, useState } from 'react';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { FlatList, TouchableOpacity, View, Pressable } from 'react-native';
import { useQueryGetTargetUserPeopleProfile } from '@/queries/targetUser/userProfileHooks';
import { BlurView } from 'expo-blur';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useCometaStore } from '@/store/cometaStore';
import { Stack, useRouter } from 'expo-router';
import { EventItem, EventItemSkeleton, IBucketListItem } from '@/components/userProfile/components/eventItem';
import { NewFriendsModal } from '@/components/modal/newFriends/newFriends';
import { GradientHeading } from '@/components/text/gradientText';
import { Condition } from '@/components/utils/ifElse';
import { HeaderUserProfile, HeaderSkeleton } from '@/components/userProfile/components/headerUser';
import { VStack } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { ScrollView } from 'react-native-gesture-handler';


export default function TargetUserProfileScreen() {
  const { theme, styles } = useStyles(styleSheet);
  const router = useRouter();
  const targetUser = useCometaStore(state => state.targetUser);
  const detailedProfile = useQueryGetTargetUserPeopleProfile(targetUser?.uid ?? '');
  const bucketList = useInfiniteQueryGetTargetUserBucketList(targetUser?.id);
  const matches = useInfiniteQueryGetSameMatchedEventsByTwoUsers(targetUser?.uid ?? '');
  const [showNewFriendsModal, setShowNewFriendsModal] = useState(false);

  const handleInfinteBucketList = () => {
    if (bucketList) {
      const { hasNextPage, isFetching } = bucketList;
      hasNextPage && !isFetching && bucketList.fetchNextPage();
    }
  };
  const handleInfinteMatches = () => {
    if (matches) {
      const { hasNextPage, isFetching } = matches;
      hasNextPage && !isFetching && matches.fetchNextPage();
    }
  };

  const bucketListEvents: IBucketListItem[] = (
    bucketList.data?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item?.event?.id,
            img: item?.event?.photos.at(0)?.url,
            placeholder: item?.event?.photos.at(0)?.placeholder,
            location: item?.event?.location?.name,
          })
        )
      )) || []
  );
  const matchesEvents: IBucketListItem[] = (
    matches.data?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item?.photos[0]?.id,
            img: item?.photos[0]?.url,
            placeholder: item?.photos[0]?.placeholder,
            location: item?.location?.name,
          })
        )
      )) || []
  );

  const renderMatchedItem = useCallback(({ item, index }: { item: IBucketListItem, index: number }) => (
    <Pressable
      key={item?.id}
      onPress={() => router.push(`/(userStacks)/matchedEvents?index=${index}`)}
      style={{
        position: 'relative',
        width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
        flex: 1,
        marginHorizontal: theme.spacing.sp6
      }}>
      <EventItem item={item} />
    </Pressable>
  ), []);
  const renderBucketItem = useCallback(({ item }: { item: IBucketListItem }) => (
    <Pressable
      key={item?.id}
      style={{
        position: 'relative',
        width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
        flex: 1,
        marginHorizontal: theme.spacing.sp6
      }}>
      <EventItem item={item} />
    </Pressable>
  ), []);

  return (
    <>
      <NewFriendsModal
        open={showNewFriendsModal}
        onClose={() => setShowNewFriendsModal(false)}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          animation: 'slide_from_bottom',
          headerBackVisible: false,
          headerRight() {
            return (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.closeButton}
              >
                <AntDesign
                  name="closecircle"
                  size={theme.spacing.sp10}
                  color={theme.colors.red100}
                />
              </TouchableOpacity>
            );
          },
          headerTitleAlign: 'center',
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s8 }]}>
              {detailedProfile.data?.username || targetUser?.username}
            </GradientHeading>
          ),
        }}
      />
      <ScrollView>
        <View style={{ position: 'relative', paddingHorizontal: theme.spacing.sp6, paddingTop: theme.spacing.sp7 }}>

          <Condition
            if={detailedProfile.isSuccess}
            then={(
              <HeaderUserProfile
                isTargetUser={true}
                userProfile={detailedProfile.data}
                onPresss={() => setShowNewFriendsModal(true)}
              />
            )}
            else={<HeaderSkeleton isTargetUser={true} />}
          />
        </View>

        <VStack styles={{ marginTop: theme.spacing.sp6 }}>
          <Heading
            style={{
              paddingHorizontal: theme.spacing.sp12,
              paddingBottom: theme.spacing.sp1
            }}
            size='s6'
          >
            Matches
          </Heading>
          <Condition
            if={matches.isSuccess}
            then={(
              <View style={{ position: 'relative' }}>
                <Condition
                  if={false}
                  then={(
                    <BlurView intensity={100}
                      style={{
                        width: (UnistylesRuntime.screen.width - (2 * theme.spacing.sp6)),
                        height: UnistylesRuntime.screen.height * 0.25,
                        position: 'absolute',
                        zIndex: 100,
                        left: theme.spacing.sp6,
                        borderRadius: theme.spacing.sp7,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <FontAwesome name="lock" size={theme.spacing.sp14} color={theme.colors.gray200} />
                    </BlurView>
                  )}
                />
                <FlatList
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  data={matchesEvents}
                  pagingEnabled={true}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  onEndReachedThreshold={0.5}
                  onEndReached={handleInfinteMatches}
                  renderItem={renderMatchedItem}
                />
              </View>
            )}
            else={(
              <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
                <EventItemSkeleton />
              </View>
            )}
          />
        </VStack>

        <VStack gap={theme.spacing.sp6} styles={{ marginTop: theme.spacing.sp6 }}>
          <VStack>
            <Heading
              style={{ paddingHorizontal: theme.spacing.sp12, paddingBottom: theme.spacing.sp1 }}
              size='s6'
            >
              Bucketlist
            </Heading>
            <Condition
              if={bucketList.isSuccess}
              then={(
                <FlatList
                  data={bucketListEvents}
                  nestedScrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  pagingEnabled={true}
                  onEndReachedThreshold={0.5}
                  onEndReached={handleInfinteBucketList}
                  renderItem={renderBucketItem}
                />
              )}
              else={(
                <View style={{ paddingHorizontal: theme.spacing.sp6 }}>
                  <EventItemSkeleton />
                </View>
              )}
            />
          </VStack>
        </VStack>
        <View style={{ height: tabBarHeight * 3 }} />
      </ScrollView>
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  closeButton: {
    padding: theme.spacing.sp6,
    borderRadius: theme.spacing.sp4,
    position: 'absolute',
    right: 0
  }
}));
