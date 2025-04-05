import { FlashList } from '@shopify/flash-list';
import Skeleton, { SkeletonLoading } from 'expo-skeleton-loading';
import { FC, ReactNode } from 'react';
import { View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { HStack, VStack } from '../utils/stacks';


const MySkeleton = Skeleton as FC<SkeletonLoading & { children: ReactNode }>;


interface IProps {
  items?: number
}
export const AvatarSkeletonList: FC<IProps> = ({ items = 8 }) => {
  const { theme } = useStyles();
  return (
    <FlashList
      data={Array.from({ length: items })}
      estimatedItemSize={60}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerStyle={{ paddingVertical: theme.spacing.sp6 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      renderItem={() => (
        <MySkeleton background={theme.colors.gray200} highlight={theme.colors.slate100}>
          <HStack
            $y='center'
            gap={theme.spacing.sp4}
            styles={{ paddingHorizontal: theme.spacing.sp6 }}
          >
            <View style={{
              backgroundColor: theme.colors.gray200,
              width: 60,
              height: 60,
              borderRadius: 99_999
            }} />
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
            <View style={{
              width: 94,
              backgroundColor: theme.colors.gray200,
              borderRadius: theme.spacing.sp2,
              height: 34,
            }} />
          </HStack>
        </MySkeleton>
      )}
    />
  );
};
