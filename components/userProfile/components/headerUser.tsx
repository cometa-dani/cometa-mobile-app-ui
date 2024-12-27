import { Carousel } from '@/components/carousel/carousel';
import { ExpandableText } from '@/components/text/expandableText';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import { HStack, VStack } from '@/components/utils/stacks';
import { calAge } from '@/helpers/calcAge';
import { IGetDetailedUserProfile } from '@/models/User';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FC, ReactNode } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';
import { Condition } from '@/components/utils/ifElse';
import { Button } from '@/components/button/button';
const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


interface IProps {
  userProfile?: IGetDetailedUserProfile,
  isTargetUser?: boolean
}
export const HeaderUserProfile: FC<IProps> = ({ userProfile, isTargetUser = false }) => {
  const { theme, styles } = useStyles(styleSheet);
  return (
    <VStack gap={theme.spacing.sp6}>
      <Carousel photos={userProfile?.photos ?? []} />

      <Condition
        if={isTargetUser}
        then={(
          <Button variant='primary' onPress={() => { }} >
            FOLLOW
          </Button>
        )}
      />

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
  );
};


interface IHeaderSkeletonProps {
  isTargetUser?: boolean
}
export const HeaderSkeleton: FC<IHeaderSkeletonProps> = ({ isTargetUser = false }) => {
  const { theme, styles } = useStyles(styleSheet);
  return (
    <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
      <VStack gap={theme.spacing.sp6}>
        <View
          style={{
            width: '100%',
            aspectRatio: 1.2,
            backgroundColor: theme.colors.gray200,
            borderRadius: theme.spacing.sp7
          }}
        />
        <Condition
          if={isTargetUser}
          then={(
            <Button
              style={{ backgroundColor: theme.colors.gray200 }}
              variant='primary'
              onPress={() => { }}
            >
              FOLLOW
            </Button>
          )}
        />
        <VStack styles={styles.container} gap={theme.spacing.sp1} >
          <Heading size='s7'>
            User name, your age
          </Heading>
          <HStack gap={theme.spacing.sp1}>
            <Ionicons name="bag-remove-outline" size={theme.spacing.sp8} color={theme.colors.gray900} />
            <TextView ellipsis={true}>{'what is your occupation'}</TextView>
          </HStack>
          <HStack gap={theme.spacing.sp2}>
            <HStack gap={theme.spacing.sp1}>
              <FontAwesome name="map-o" size={theme.spacing.sp7} color={theme.colors.gray900} />
              <TextView>{'where you from'},</TextView>
            </HStack>
            <HStack>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={22}
                style={{ color: theme.colors.gray900 }}
              />
              <TextView style={{ marginLeft: -2 }}>
                {'where you live'}
              </TextView>
            </HStack>
          </HStack>
        </VStack>

        <View style={styles.container}>
          <Heading size='s6'>
            Bio
          </Heading>
          <ExpandableText>{'tell us something about yourself'}</ExpandableText>
        </View>

        <View style={styles.container}>
          <Heading size='s6'>
            Languages
          </Heading>
          <ExpandableText>{'languages you speak'}</ExpandableText>
        </View>

        <Heading size='s6' style={{
          paddingHorizontal: theme.spacing.sp6,
          paddingBottom: theme.spacing.sp1
        }}>
          Bucketlist
        </Heading>
      </VStack>
    </MySkeleton>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.white100,
    borderRadius: theme.spacing.sp6,
    padding: theme.spacing.sp6
  },
}));
