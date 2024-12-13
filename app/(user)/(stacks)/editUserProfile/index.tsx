import React, { ReactNode, } from 'react';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { defaultImgPlaceholder, MAX_NUMBER_PHOTOS } from '../../../../constants/vars';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationDeleteUserById, useMutationUpdateUserById, useQueryGetUserProfile } from '@/queries/currentUser/userHooks';
import { useInfiniteQueryGetBucketListScreen } from '@/queries/currentUser/eventHooks';
import { IPhoto } from '@/models/Photo';
import * as ImagePicker from 'expo-image-picker';


export default function EditUserProfileScreen(): ReactNode {
  const { styles, theme } = useStyles(styleSheet);
  const queryClient = useQueryClient();
  const deleteUser = useMutationDeleteUserById();
  const updateUser = useMutationUpdateUserById();
  // const mutateLoggedInUserProfileById = useMutationUpdateUserById();


  // queries
  const { data: loggedInUserBucketList } = useInfiniteQueryGetBucketListScreen();
  const { data: userProfile } = useQueryGetUserProfile();
  const userPhotos: IPhoto[] = userProfile?.photos ?? [];
  const remainingPhotosToUpload: number = MAX_NUMBER_PHOTOS - (userPhotos?.length || 0);


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
    deleteUser.mutate({ userID: userProfile?.id as number, photoUuid });
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
      <Stack.Screen
        options={{
          animation: 'default',
          gestureDirection: 'horizontal',
          contentStyle: { backgroundColor: theme.colors.white80 },
          fullScreenGestureEnabled: true,
          headerShadowVisible: false,
          headerTitle: 'Edit Profile',
          headerTitleAlign: 'center'
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Condition
          if={false}
          then={(
            <Center styles={{ flex: 1 }}>
              <ActivityIndicator
                size="large"
                style={{ marginTop: -theme.spacing.sp8 }}
                color={theme.colors.red100}
              />
            </Center>
          )}
          else={(
            <Center styles={{ flex: 1 }}>
              <TextView>Edit Profile</TextView>
            </Center>
          )}
        />
      </SafeAreaView>
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  eventItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%'
  }
}));
