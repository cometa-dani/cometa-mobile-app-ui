import { GradientHeading } from '@/components/text/gradientText';
import { IPhoto } from '@/models/Photo';
import { useInfiniteQueryGetBucketListScreen } from '@/queries/currentUser/eventHooks';
import { useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { Tabs, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { TouchableOpacity, View, SafeAreaView } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { TextView } from '@/components/text/text';
import { Heading } from '@/components/text/heading';
import { calAge } from '@/helpers/calcAge';
import { HStack, VStack } from '@/components/utils/stacks';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { ExpandableText } from '@/components/text/expandableText';
import { imageTransition } from '@/constants/vars';
import { Badge } from '@/components/button/badge';


export default function UserProfileScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();
  const {
    data: userBucketList,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryGetBucketListScreen();
  const handleInfiniteFetch = () => !isFetching && hasNextPage && fetchNextPage();
  const { data: userProfile } = useQueryGetUserProfile();
  const bucketListEvents = (
    userBucketList?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item.event?.photos[0]?.id,
            img: item.event?.photos[0]?.url,
            placeholder: item.event?.photos[0]?.placeholder,
            location: item.event?.location?.name
          })
        )
      )) || []
  );

  const renderItem = useCallback(({ item }: { item: IPhoto }) => {
    return (
      <Image
        recyclingKey={item.url}
        transition={imageTransition}
        placeholder={{ thumbhash: item.placeholder }}
        source={{ uri: item.url }}
        style={styles.avatarImage}
        contentFit='cover'
      />
    );
  }, []);

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
      <SafeAreaView style={{ flex: 1 }}>
        <FlashList
          data={bucketListEvents}
          estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
          contentContainerStyle={{ paddingVertical: theme.spacing.sp7 }}
          ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
          ListHeaderComponent={() => (
            <VStack gap={theme.spacing.sp6} styles={{ paddingHorizontal: theme.spacing.sp6 }}>
              <View style={{ width: '100%', overflow: 'hidden', borderRadius: theme.spacing.sp7 }}>
                <FlashList
                  data={userProfile?.photos}
                  horizontal={true}
                  pagingEnabled={true}
                  decelerationRate={'normal'}
                  showsHorizontalScrollIndicator={false}
                  estimatedItemSize={UnistylesRuntime.screen.height * 0.33}
                  renderItem={renderItem}
                />
              </View>

              <VStack styles={styles.container} gap={theme.spacing.sp1} >
                <Heading size='s7'>
                  {userProfile?.name}, {userProfile?.birthday && calAge(new Date(userProfile?.birthday))}
                </Heading>
                <HStack gap={theme.spacing.sp1}>
                  <Ionicons name="bag-remove-outline" size={theme.spacing.sp8} color={theme.colors.gray900} />
                  <TextView ellipsis={true}>{userProfile?.occupation || 'what is your occupation'}</TextView>
                </HStack>
                <HStack gap={theme.spacing.sp2}>
                  <HStack gap={theme.spacing.sp1}>
                    <FontAwesome name="map-o" size={theme.spacing.sp7} color={theme.colors.gray900} />
                    <TextView>{userProfile?.homeTown || 'where you from'},</TextView>
                  </HStack>
                  <HStack>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={22}
                      style={{ color: theme.colors.gray900 }}
                    />
                    <TextView style={{ marginLeft: -2 }}>
                      {userProfile?.currentLocation || 'where you live'}
                    </TextView>
                  </HStack>
                </HStack>
              </VStack>

              <View style={styles.container}>
                <Heading size='s6'>
                  Bio
                </Heading>
                <ExpandableText>{userProfile?.biography || 'tell us something about yourself'}</ExpandableText>
              </View>

              <View style={styles.container}>
                <Heading size='s6'>
                  Languages
                </Heading>
                <ExpandableText>{userProfile?.languages?.join(', ') || 'languages you speak'}</ExpandableText>
              </View>

              <Heading size='s6' style={{
                paddingHorizontal: theme.spacing.sp6,
                paddingBottom: theme.spacing.sp1
              }}>
                Bucketlist
              </Heading>
            </VStack>
          )}
          onEndReachedThreshold={0.4}
          onEndReached={handleInfiniteFetch}
          renderItem={({ item }) => (
            <View style={{ position: 'relative' }}>
              <Image
                placeholder={{ thumbhash: item.placeholder }}
                recyclingKey={item.img}
                source={{ uri: item.img }}
                style={styles.eventImage}
                contentFit='cover'
                transition={imageTransition}
              />
              <Badge>
                {item.location}
              </Badge>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}


const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.white100,
    borderRadius: theme.spacing.sp6,
    padding: theme.spacing.sp6
  },
  avatarImage: {
    width: rt.screen.width - (theme.spacing.sp6 * 2),
    aspectRatio: 1.2
  },
  eventImage: {
    height: rt.screen.height * 0.25,
    borderRadius: theme.spacing.sp7,
    marginHorizontal: theme.spacing.sp6
  }
}));
