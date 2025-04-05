import { SafeAreaView, View } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FC, ReactNode } from 'react';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { AvatarSkeletonList } from '@/components/skeleton/avatarSkeleton';
import { useNotifications } from '@/queries/notification/useNotifications';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { FontAwesome } from '@expo/vector-icons';
import { INotification } from '@/models/Notification';
import { useCometaStore } from '@/store/cometaStore';


export default function NotificationsScreen(): ReactNode {
  const { theme, styles } = useStyles(styleSheet);
  const { data, isLoading } = useNotifications();
  const { userProfile } = useCometaStore();
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
          if={isLoading}
          then={(<AvatarSkeletonList items={11} />)}
          else={(
            <FlashList
              contentInset={{ bottom: tabBarHeight * 2 }}
              contentContainerStyle={{ paddingTop: theme.spacing.sp4 }}
              onEndReachedThreshold={0.5}
              estimatedItemSize={40}
              data={data}
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
                    isCurrentUser={userProfile?.id === item.senderId}
                  />
                </Swipeable>
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

  if (item.status === 'PENDING') {
    return (
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
    );
  }
  if (item.status === 'ACCEPTED' && isCurrentUser) {
    return (
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
    );
  }
  if (item.status === 'ACCEPTED' && !isCurrentUser) {
    return (
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
