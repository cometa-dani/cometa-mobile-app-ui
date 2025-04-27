import { tabBarHeight } from '@/components/tabBar/tabBar';
import { EventItem, IBucketListItem } from '@/components/userProfile/components/eventItem';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { useQueryGetEventsPaginated } from '@/queries/organization/eventHooks';
import { useQueryGetCompanyProfile } from '@/queries/organization/organizationHooks';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';


export default function HomeScreen() {
  const { theme } = useStyles(stylesheet);
  useQueryGetCompanyProfile();
  const { data: events, isSuccess } = useQueryGetEventsPaginated();

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
    <>
      <SystemBars style='auto' />
      <Condition
        if={isSuccess}
        then={(
          <View style={{ flex: 1, position: 'relative' }}>
            <FlashList
              data={eventsList}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
              contentContainerStyle={{
                paddingVertical: theme.spacing.sp6,
                paddingHorizontal: theme.spacing.sp4
              }}
              ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
              ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
              renderItem={renderBucketItem}
            />
          </View>
        )}
        else={(
          <Center styles={{ flex: 1 }}>
            <ActivityIndicator
              size="large"
              style={{ marginTop: -theme.spacing.sp8 }}
              color={theme.colors.red100}
            />
          </Center>
        )}
      />
    </>
    // eslint-disable-next-line react-native/no-inline-styles,react-native/no-color-literals
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
