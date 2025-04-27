import { tabBarHeight } from '@/components/tabBar/tabBar';
// import { TextView } from '@/components/text/text';
import { EventItem } from '@/components/userProfile/components/eventItem';
import { IEvent } from '@/models/Event';
import { useQueryGetEventsPaginated } from '@/queries/organization/eventHooks';
import { useQueryGetCompanyProfile } from '@/queries/organization/organizationHooks';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';


export default function HomeScreen() {
  const { theme } = useStyles(stylesheet);
  useQueryGetCompanyProfile();
  const { data: events } = useQueryGetEventsPaginated();

  const renderBucketItem = useCallback(({ item }: { item: IEvent }) => (
    <EventItem item={item} />
  ), []);

  return (
    <FlashList
      // data={isListLoading ? dummyBucketListItems : bucketListEvents}
      data={events}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
      // contentContainerStyle={{
      //   paddingVertical: theme.spacing.sp7,
      //   paddingHorizontal: theme.spacing.sp6
      // }}
      ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      // ListHeaderComponent={renderHeader}
      onEndReachedThreshold={0.4}
      // onEndReached={onBucketListEndReached}
      renderItem={renderBucketItem}
    />
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
