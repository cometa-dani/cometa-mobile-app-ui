import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FC, ReactNode, useCallback } from 'react';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { AvatarSkeletonList } from '@/components/skeleton/avatarSkeleton';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { FontAwesome } from '@expo/vector-icons';
import { INotification } from '@/models/Notification';
import { useCometaStore } from '@/store/cometaStore';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/queries/queryKeys';
import { Center } from '@/components/utils/stacks';
import { EmptyMessage } from '@/components/empty/Empty';


export default function NotificationsScreen(): ReactNode {
  const { theme, styles } = useStyles(styleSheet);
  const currentUser = useCometaStore(state => state.userProfile);
  const queryClient = useQueryClient();
  const notifications = queryClient.getQueryData<INotification[]>([QueryKeys.GET_NOTIFICATIONS, currentUser?.id]);

  useFocusEffect(
    useCallback(() => {
      const lastNotification = notifications?.at(0);
      if (lastNotification?.read) return;
      if (currentUser?.id && lastNotification?.id) {
        // notificationService
        // .setNotificationAsSeenByUser(currentUser?.id, lastNotification?.id)
        // .then(() => setNewNotifications(false))
        // .catch();
      }
    }, [notifications?.length]),
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
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white100 }}>
        <Condition
          if={!notifications}
          then={(<AvatarSkeletonList items={11} />)}
          else={(
            <Condition
              if={notifications?.length === 0}
              then={(
                <Center styles={{ flex: 1, padding: 34, paddingTop: 0 }}>
                  <EmptyMessage
                    title='Oops! Looks like your notification list is empty'
                    subtitle='Head back to the bucketlist and meet new friends!'
                  />
                </Center>
              )}
              else={(
                <FlashList
                  contentInset={{ bottom: tabBarHeight * 2 }}
                  contentContainerStyle={{ paddingTop: theme.spacing.sp4 }}
                  onEndReachedThreshold={0.5}
                  estimatedItemSize={40}
                  data={notifications}
                  keyExtractor={item => item.id.toString()}
                  ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
                  renderItem={({ item }) => (
                    <Swipeable
                      renderRightActions={(_a, _b, swipeable) => (
                        <RectButton
                          onPress={() => {
                            swipeable?.close();
                          }}
                          style={styles.deleteButton}
                        >
                          <FontAwesome
                            name='trash-o'
                            size={22}
                            color={theme.colors.red100}
                          />
                        </RectButton>
                      )}
                    >
                      <Message
                        item={item}
                        isCurrentUser={currentUser?.id === item.senderId}
                      />
                    </Swipeable>
                  )}
                />
              )}
            />
          )}
        />
      </SafeAreaView>
    </>
  );
}


interface MessageProps {
  item: INotification;
  isCurrentUser: boolean;
}
const Message: FC<MessageProps> = ({ item, isCurrentUser = false }) => {
  const { styles } = useStyles(styleSheet);
  const pending = 'wants to match with you!';
  const newMatch = 'is your new match!';
  const router = useRouter();
  const setSelectedTargetUser = useCometaStore(state => state.setTargetUser);

  if (item.message === 'PENDING') {
    return (
      <TouchableOpacity onPress={() => {
        setSelectedTargetUser({
          ...item.sender,
          friendshipId: item.id,
          isFriend: false,
        });
        router.push('/(userStacks)/targetUser');
      }}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.sender?.photos[0]?.url }}
              style={styles.image}
            />
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
            <TextView bold={true}> {item?.sender.name} </TextView>
            <TextView> {pending} </TextView>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  if (item.message === 'ACCEPTED' && isCurrentUser) {
    return (
      <TouchableOpacity onPress={() => {
        setSelectedTargetUser({
          ...item.receiver,
          friendshipId: item.id,
          isFriend: true,
        });
        router.push('/(userStacks)/targetUser');
      }}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.receiver?.photos[0]?.url }}
              style={styles.image}
            />
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
            <TextView bold={true}> {item?.receiver.name} </TextView>
            <TextView> {newMatch} </TextView>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  if (item.message === 'ACCEPTED' && !isCurrentUser) {
    return (
      <TouchableOpacity onPress={() => {
        setSelectedTargetUser({
          ...item.sender,
          friendshipId: item.id,
          isFriend: true,
        });
        router.push('/(userStacks)/targetUser');
      }}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.sender?.photos[0]?.url }}
              style={styles.image}
            />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
            <TextView> Your match request with </TextView>
            <TextView bold={true}>{item?.sender.name}</TextView>
            <TextView> was accepted! </TextView>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};


const styleSheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.white100,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sp6,
    paddingVertical: theme.spacing.sp4,
    gap: theme.spacing.sp4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray50,
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
    justifyContent: 'center',
  },
}));
