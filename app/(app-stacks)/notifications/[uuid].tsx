import { StyleSheet, SafeAreaView, View } from 'react-native';
import { useColors, Text } from '../../../components/Themed';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { BaseButton, RectButton, Swipeable } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { gray_50, red_100 } from '../../../constants/colors';
import { useCometaStore } from '../../../store/cometaStore';
import notificationService from '../../../services/notificationService';
import { INotificationData } from '../../../store/slices/notificationSlice';
import { If } from '../../../components/utils';
import { useCallback } from 'react';


export default function NotificationsScreen(): JSX.Element {
  const { background } = useColors();
  const loggedInUserUUID = useLocalSearchParams<{ uuid: string }>()['uuid'];
  const notificationsList = useCometaStore(state => state.notificationsList) ?? [];

  const handleDeleteNotification = (notification: INotificationData) => {
    if (!notification?.chatUUID) return;
    notificationService.deleteNotification(loggedInUserUUID, notification.user._id);
  };

  useFocusEffect(
    useCallback(() => {
      const lastMessage = notificationsList.at(0);
      if (!lastMessage || lastMessage?.user?.isSeen) return;
      notificationService.setNotificationAsSeen(loggedInUserUUID, lastMessage.user._id)
        .then()
        .catch();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen
        options={{
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
          headerShadowVisible: false,
          headerTitle: 'Notifications',
          headerTitleAlign: 'center'
        }}
      />

      <If
        condition={notificationsList.length === 0}
        render={(
          <View style={styles.titleContainer}>
            <Text>No notifications yet</Text>
          </View>
        )}
        elseRender={(
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
                    <FontAwesome name='trash-o' size={26} color={red_100} />
                  </RectButton>
                )}>
                <BaseButton
                  onPress={() => router.push(`/targetUserProfile/${notification.user._id}`)}
                  style={styles.container}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: notification.user?.avatar }} style={styles.image} />
                  </View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{
                      maxWidth: '80%',
                    }}
                  >
                    {notification.user?.message}
                  </Text>
                </BaseButton>
              </Swipeable>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },

  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 16
  },

  imageContainer: {
    width: 46,
    height: 46,
    borderRadius: 25,
    overflow: 'hidden'
  },

  image: { width: 50, height: 50 },

  deleteButton: {
    backgroundColor: gray_50,
    borderRadius: 18,
    justifyContent: 'center',
    marginRight: 20,
    padding: 20,
  },
});
