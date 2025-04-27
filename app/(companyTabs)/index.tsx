import { tabBarHeight } from '@/components/tabBar/tabBar';
import { EventItem, IBucketListItem } from '@/components/userProfile/components/eventItem';
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

  const renderBucketItem = useCallback(({ item }: { item: IBucketListItem }) => (
    <EventItem item={item} />
  ), []);

  const eventsList: IBucketListItem[] = (
    events?.map((event) => ({
      id: event.id,
      location: event.location,
      img: event.photos.at(0)?.url,
      placeholder:
        event.photos.at(0)?.placeholder
    })) ?? []
  );

  return (
    <FlashList
      data={eventsList}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
      contentContainerStyle={{
        paddingVertical: theme.spacing.sp6,
        paddingHorizontal: theme.spacing.sp4
      }}
      ListFooterComponentStyle={{ height: tabBarHeight * 2 }}
      ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
      // onEndReachedThreshold={0.4}
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
