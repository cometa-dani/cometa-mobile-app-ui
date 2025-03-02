import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { BaseButton, RectButton } from 'react-native-gesture-handler';
// import { FontAwesome } from '@expo/vector-icons';
// import { gray_50, red_100 } from '../../../constants/colors';
import { useCometaStore } from '../../store/cometaStore';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
// import notificationService from '../../services/notificationService';
// import { INotificationData } from '../../store/slices/notificationSlice';
import { ReactNode, useCallback } from 'react';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { AvatarSkeletonList } from '@/components/skeleton/avatarSkeleton';


export default function NotificationsScreen(): ReactNode {
  const { theme } = useStyles(styleSheet);
  // const loggedInUserUUID = useLocalSearchParams<{ uuid: string }>()['uuid'];
  // const notificationsList = useCometaStore(state => state.notificationsList) ?? [];

  // const handleDeleteNotification = (notification: INotificationData) => {
  //   if (!notification?.chatUUID) return;
  //   // notificationService.deleteNotification(loggedInUserUUID, notification.user._id);
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     const lastMessage = notificationsList.at(0);
  //     if (!lastMessage || lastMessage?.user?.isSeen) return;
  //     // notificationService.setNotificationAsSeen(loggedInUserUUID, lastMessage.user._id)
  //     //   .then()
  //     //   .catch();
  //   }, [])
  // );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Notifications',
          headerTitleAlign: 'center'
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <TextView>Hello</TextView>
        <View style={{ flex: 1, height: '100%' }}>
          {/* <Condition
                    if={isLoading}
                    then={(<AvatarSkeletonList items={11} />)}
                    else={(
                      <FlashList
                        contentInset={{ bottom: tabBarHeight * 2 }}
                        contentContainerStyle={{ paddingTop: theme.spacing.sp4 }}
                        onEndReached={handleUserInfiniteScroll}
                        onEndReachedThreshold={0.5}
                        estimatedItemSize={60}
                        data={usersData}
                        keyExtractor={item => item.id.toString()}
                        ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
                        renderItem={renderItem}
                      />
                    )}
                  /> */}
        </View>
      </SafeAreaView>
    </>
  );
}


const styleSheet = createStyleSheet(() => ({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 14
  },
  deleteButton: {
    borderRadius: 18,
    justifyContent: 'center',
    marginRight: 20,
    padding: 20,
  },
  image: { height: 50, width: 50 },
  imageContainer: {
    borderRadius: 25,
    height: 46,
    overflow: 'hidden',
    width: 46
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 24
  },
}));
