import { FlashList } from '@shopify/flash-list';
import { FC, ReactNode, useCallback } from 'react';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { tabBarHeight } from '../tabBar/tabBar';
import { View } from 'react-native';
import { HStack, VStack } from '../utils/stacks';
import { Carousel } from '../carousel/carousel';
import { Heading } from '../text/heading';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextView } from '../text/text';
import { IGetDetailedUserProfile, IGetTargetUser } from '@/models/User';
import { calAge } from '@/helpers/calcAge';
import { ExpandableText } from '../text/expandableText';
import { Image } from 'expo-image';
import { Badge } from '../button/badge';
import { imageTransition } from '@/constants/vars';
import { IGetPaginatedLikedEventsBucketList } from '@/models/LikedEvent';
import { InfiniteData } from '@tanstack/react-query';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';


type IBucketListItem = {
  id: number;
  img?: string;
  placeholder?: string;
  location?: string;
}

interface IProps {
  userBucketList?: InfiniteData<IGetPaginatedLikedEventsBucketList, unknown>,
  userProfile?: IGetDetailedUserProfile | IGetTargetUser,
  onBucketListEndReached: () => void,
  isTargetUser?: boolean,
  isLoading?: boolean
}
export const UserProfile: FC<IProps> = ({
  userBucketList,
  userProfile,
  isTargetUser = false,
  isLoading = false,
  onBucketListEndReached
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const bucketListEvents: IBucketListItem[] = (
    userBucketList?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item.event?.photos[0]?.id,
            img: item.event?.photos[0]?.url,
            placeholder: item.event?.photos[0]?.placeholder,
            location: item.event?.location?.name,
          })
        )
      )) || []
  );

  const renderBucketItem = useCallback(({ item }: { item: IBucketListItem }) => (
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
  ), []);

  if (isLoading) {
    return <UseProfileSkeleton />;
  }
  return (
    <FlashList
      data={bucketListEvents}
      estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
      contentContainerStyle={{ paddingVertical: theme.spacing.sp7 }}
      ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
      keyExtractor={item => item.id?.toString()}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      ListHeaderComponent={() => (
        <VStack gap={theme.spacing.sp6} styles={{ paddingHorizontal: theme.spacing.sp6 }}>

          <Carousel photos={userProfile?.photos ?? []} />

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
      onEndReached={onBucketListEndReached}
      renderItem={renderBucketItem}
    />
  );
};


const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.white100,
    borderRadius: theme.spacing.sp6,
    padding: theme.spacing.sp6
  },
  eventImage: {
    height: rt.screen.height * 0.25,
    borderRadius: theme.spacing.sp7,
    marginHorizontal: theme.spacing.sp6
  }
}));


const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


const UseProfileSkeleton: FC = () => {
  const { theme, styles } = useStyles(stylesheet);
  return (
    <FlashList
      data={[1, 2, 3, 4, 5, 6, 7]}
      estimatedItemSize={60}
      contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      renderItem={() => (
        <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
          <HStack
            $y='center'
            gap={theme.spacing.sp4}
            styles={{ paddingHorizontal: theme.spacing.sp6 }}
          >
            <View style={{ backgroundColor: theme.colors.gray200 }} />
            <VStack
              $y='center'
              gap={theme.spacing.sp1}
              styles={{ flex: 1 }}
            >
              <View style={{
                backgroundColor: theme.colors.gray200,
                height: 16,
                width: '60%',
                flexDirection: 'row',
                borderRadius: 10
              }}
              />
              <View style={{
                backgroundColor: theme.colors.gray200,
                height: 16,
                width: '80%',
                flexDirection: 'row',
                borderRadius: 10
              }}
              />
            </VStack>
          </HStack>
        </MySkeleton>
      )}
    />
  );
};
