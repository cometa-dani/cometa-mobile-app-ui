import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { BaseButton, RectButton } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
// import { gray_50, red_100 } from '../../../constants/colors';
import { useCometaStore } from '../../store/cometaStore';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import notificationService from '../../services/notificationService';
import { INotificationData } from '../../store/slices/notificationSlice';
import { ReactNode, useCallback } from 'react';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { useStyles } from 'react-native-unistyles';


export default function NotificationsScreen(): ReactNode {
  const { theme } = useStyles();
  // const loggedInUserUUID = useLocalSearchParams<{ uuid: string }>()['uuid'];
  const notificationsList = useCometaStore(state => state.notificationsList) ?? [];

  const handleDeleteNotification = (notification: INotificationData) => {
    if (!notification?.chatUUID) return;
    // notificationService.deleteNotification(loggedInUserUUID, notification.user._id);
  };

  useFocusEffect(
    useCallback(() => {
      const lastMessage = notificationsList.at(0);
      if (!lastMessage || lastMessage?.user?.isSeen) return;
      // notificationService.setNotificationAsSeen(loggedInUserUUID, lastMessage.user._id)
      //   .then()
      //   .catch();
    }, [])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerTitleAlign: 'center'
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white80 }}>
        <Condition
          if={notificationsList.length === 0}
          then={(
            <View style={styles.titleContainer}>
              <TextView>No notifications yet</TextView>
            </View>
          )}
          else={(
            <FlashList
              data={notificationsList}
              contentContainerStyle={{ paddingVertical: 20 }}
              keyExtractor={(item, index) => index.toString()}
              estimatedItemSize={77}
              renderItem={({ item: notification }) => (
                <Swipeable
                  renderRightActions={(_a, _b, swipeable) => (
                    <RectButton
                      onPress={() => {
                        swipeable?.close();
                        handleDeleteNotification(notification);
                      }}
                      style={styles.deleteButton}
                    >
                      {/* <FontAwesome name='trash-o' size={26} color={red_100} /> */}
                    </RectButton>
                  )}>
                  <BaseButton
                    onPress={() => router.push(`/targetUserProfile/${notification.user._id}`)}
                    style={styles.container}
                  >
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: notification.user?.avatar }} style={styles.image} />
                    </View>
                    <TextView
                      // numberOfLines={1}
                      // ellipsizeMode='tail'
                      ellipsis={true}
                      style={{
                        maxWidth: '80%',
                      }}
                    >
                      {notification.user?.message}
                    </TextView>
                  </BaseButton>
                </Swipeable>
              )}
            />
          )}
        />
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 14
  },

  deleteButton: {
    // backgroundColor: gray_50,
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
});
