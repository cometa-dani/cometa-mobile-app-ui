import { SafeAreaView, View } from 'react-native';
import { Stack } from 'expo-router';
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
import { useNotifications } from '@/queries/notification/useNotifications';
import { tabBarHeight } from '@/components/tabBar/tabBar';


export default function NotificationsScreen(): ReactNode {
  const { theme, styles } = useStyles(styleSheet);
  const { data, isLoading } = useNotifications();
  console.log(data);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerTitleAlign: 'center'
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
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
                  // containerStyle={styles.container}
                  renderRightActions={() => (
                    <BaseButton
                      onPress={() => console.log('delete')}
                      style={styles.deleteButton}
                    >
                      <TextView>
                        delete
                      </TextView>
                    </BaseButton>
                  )}
                >
                  <View style={styles.container}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.sender?.photos[0]?.url }}
                        style={styles.image}
                      />
                    </View>
                    <View style={styles.titleContainer}>
                      <TextView>{item?.status}</TextView>
                    </View>
                  </View>
                </Swipeable>
              )}
            />
          )}
        />
      </SafeAreaView>
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  container: {
    alignItems: 'center',
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
