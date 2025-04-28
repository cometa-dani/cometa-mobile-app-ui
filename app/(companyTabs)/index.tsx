import { tabBarHeight } from '@/components/tabBar/tabBar';
import { ErrorToast, InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';
import { EventItem, IBucketListItem } from '@/components/userProfile/components/eventItem';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { useMutateDeleteEvent, useQueryGetEventsPaginated } from '@/queries/organization/eventHooks';
import { useQueryGetCompanyProfile } from '@/queries/organization/organizationHooks';
import { FontAwesome } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Notifier } from 'react-native-notifier';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';


export default function HomeScreen() {
  const { theme } = useStyles(stylesheet);
  useQueryGetCompanyProfile();
  const { data: events, isSuccess } = useQueryGetEventsPaginated();
  const deleteEvent = useMutateDeleteEvent();

  const renderBucketItem = useCallback(({ item }: { item: IBucketListItem }) => (
    <Swipeable
      renderRightActions={(_a, _b, swipeable) => (
        <RectButton
          onPress={async () => {
            if (!item.id) return;
            try {
              swipeable?.close();
              Notifier.showNotification({
                title: 'Deleting...',
                description: 'your event is being deleted',
                Component: InfoToast,
              });
              await deleteEvent.mutateAsync(item.id);
              Notifier.hideNotification();
              Notifier.showNotification({
                title: 'Done',
                description: 'your event was deleted successfully',
                Component: SucessToast,
              });
            } catch (error) {
              Notifier.showNotification({
                title: 'Error',
                description: 'something went wrong, try again',
                Component: ErrorToast,
              });
            }
          }}
          style={{
            borderRadius: 18,
            justifyContent: 'center',
            marginRight: 20,
            padding: 20,
          }}
        >
          <FontAwesome
            name='trash-o'
            size={32}
            color={theme.colors.red100}
          />
        </RectButton>
      )}
    >
      <EventItem item={item} />
    </Swipeable>
  ), [deleteEvent, theme]);

  const eventsList: IBucketListItem[] = (
    events?.map((event) => ({
      name: event.name,
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
