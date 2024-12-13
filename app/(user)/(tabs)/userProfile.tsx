import { GradientHeading } from '@/components/text/gradientText';
import { MAX_NUMBER_PHOTOS } from '@/constants/vars';
import { IPhoto } from '@/models/Photo';
import { useInfiniteQueryGetBucketListScreen } from '@/queries/currentUser/eventHooks';
import { useMutationDeleteUserById, useMutationUpdateUserById, useMutationUploadUserPhotos, useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import * as ImagePicker from 'expo-image-picker';
import { Feather, FontAwesome, Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { TextView } from '@/components/text/text';
import { Heading } from '@/components/text/heading';
import { calAge } from '@/helpers/calcAge';
import { VStack } from '@/components/utils/stacks';
import { tabBarHeight } from '@/components/tabBar/tabBar';


export default function UserProfileScreen() {
  const queryClient = useQueryClient();
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();
  // mutations
  const mutateLoggedInUserPhotosUpload = useMutationUploadUserPhotos();
  const mutateLoggedInUserPhotosDelete = useMutationDeleteUserById();
  const mutateLoggedInUserProfileById = useMutationUpdateUserById();

  // queries
  const { data: loggedInUserBucketList } = useInfiniteQueryGetBucketListScreen();
  const { data: userProfile, isLoading } = useQueryGetUserProfile();
  const userPhotos: IPhoto[] = userProfile?.photos ?? [];
  const remainingPhotosToUpload: number = MAX_NUMBER_PHOTOS - (userPhotos?.length || 0);

  // toggle edit mode
  const [switchEditionModeForLoggedInUser, setSwitchEditionModeForLoggedInUser] = useState(true);

  // bucketlist
  const bucketlistLikedEvents =
    loggedInUserBucketList?.pages.
      flatMap(({ items: events }) => (
        events.map(
          item => ({
            id: item.event?.photos[0]?.id,
            img: item.event?.photos[0]?.url,
            placeholder: item.event?.photos[0]?.placeholder
          })
        )
      )) || [];

  const handleSumitLoggedInUserInfo =
    async (): Promise<void> => {
      // mutateLoggedInUserProfileById.mutate({ userId: loggedInuserProfile?.id as number, payload: values });
      // actions.setSubmitting(false);
    };

  const handlePickMultipleImages = async () => {
    if (remainingPhotosToUpload === 0) {
      return;
    }
    else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          selectionLimit: remainingPhotosToUpload, // only allows to select a number below the limit
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled && userProfile?.id) {
          const pickedImages = (result.assets).map((asset) => ({ url: asset.uri, }));

          // mutateLoggedInUserPhotosUpload.mutate({
          //   userId: loggedInuserProfile?.id,
          //   // pickedImgFiles: pickedImages
          // });
        }
      }
      catch (error) {
        // console.log(error);
      }
    }
  };


  const handleDeleteImage = async (photoUuid: string) => {
    mutateLoggedInUserPhotosDelete.mutate({ userID: userProfile?.id as number, photoUuid });
  };

  const navigateToUserProfile = (): void => {
    router.push(`/(stacks)/editUserProfile?userId=${userProfile?.id}`);
  };

  const handleLogout = (): void => {
    queryClient.clear();
    // signOut(auth);
  };

  return (
    <>
      <SystemBars style='dark' />
      <Tabs.Screen
        options={{
          headerLeft(props) {
            return (
              <TouchableOpacity
                onPress={() => router.push('/(stacks)/settings')}
                style={{ marginLeft: theme.spacing.sp6 }}
              >
                <Octicons size={theme.spacing.sp10} name='gear' color={theme.colors.gray400} />
              </TouchableOpacity>
            );
          },
          headerRight(props) {
            return (
              <TouchableOpacity
                onPress={() => router.push('/(stacks)/editUserProfile')}
                style={{ marginRight: theme.spacing.sp6 }}
              >
                {/* <FontAwesome size={theme.spacing.sp10} name='edit' color={theme.colors.gray400} /> */}
                <Feather size={theme.spacing.sp10} name='edit' color={theme.colors.gray400} />
              </TouchableOpacity >
            );
          },
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s7 }]}>
              {userProfile?.username}
            </GradientHeading>
          ),
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <FlashList
          data={bucketlistLikedEvents}
          estimatedItemSize={UnistylesRuntime.screen.height * 0.2}
          contentContainerStyle={{ paddingVertical: theme.spacing.sp7 }}
          ListFooterComponentStyle={{ height: tabBarHeight * 3 }}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sp6 }} />}
          ListHeaderComponent={() => (
            <VStack gap={theme.spacing.sp6} styles={{ paddingHorizontal: theme.spacing.sp6 }}>
              <View style={{ width: '100%', overflow: 'hidden', borderRadius: theme.spacing.sp7 }}>
                <FlashList
                  data={userProfile?.photos}
                  horizontal={true}
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  estimatedItemSize={UnistylesRuntime.screen.height * 0.33}
                  renderItem={({ item }) => (
                    <Image
                      placeholder={{ thumbhash: item.placeholder }}
                      source={{ uri: item.url }}
                      style={styles.avatarImage}
                      contentFit='cover'
                    />
                  )}
                />
              </View>

              <VStack styles={styles.container} gap={theme.spacing.sp1} >
                <Heading size='s7'>{userProfile?.name}, {userProfile?.birthday && calAge(new Date(userProfile?.birthday))}</Heading>
                <TextView ellipsis={true}>{userProfile?.occupation ?? 'occupation'}</TextView>
                <TextView>{userProfile?.homeTown ?? 'homeTown'}, {userProfile?.currentLocation ?? 'currentLocation'}</TextView>
              </VStack>

              <View style={styles.container}>
                <TextView numberOfLines={3} ellipsis={true}>
                  {userProfile?.biography ?? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis temporibus sed odit exercitationem, suscipit debitis quaerat laboriosam reprehenderit reiciendis dolore velit deserunt voluptates laudantium, accusamus dolorem cupiditate laborum natus facilis.'}
                </TextView>
              </View>

              <Heading size='s6' style={{ paddingHorizontal: theme.spacing.sp6, paddingBottom: theme.spacing.sp2 }}>Bucketlist</Heading>
            </VStack>
          )}
          renderItem={({ item }) => (
            <Image
              placeholder={{ thumbhash: item.placeholder }}
              source={{ uri: item.img }}
              style={styles.eventImage}
              contentFit='cover'
            />
          )}
        />
      </SafeAreaView>
    </>
  );
}


const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.white100,
    borderRadius: theme.spacing.sp6,
    padding: theme.spacing.sp6
  },
  avatarImage: {
    height: rt.screen.height * 0.33,
    width: rt.screen.width - (theme.spacing.sp6 * 2),
  },
  eventImage: {
    height: rt.screen.height * 0.25,
    borderRadius: theme.spacing.sp7,
    marginHorizontal: theme.spacing.sp6
  }
}));
