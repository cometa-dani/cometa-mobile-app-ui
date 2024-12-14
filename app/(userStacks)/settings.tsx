import React, { FC, ReactNode } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { RectButton, } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { defaultImgPlaceholder } from '../../constants/vars';
import { IGetBasicUserProfile } from '../../models/User';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { Center } from '@/components/utils/stacks';
import { useStyles } from 'react-native-unistyles';
import { useQueryClient } from '@tanstack/react-query';


export default function SettingsScreen(): ReactNode {
  const { theme } = useStyles();
  const queryClient = useQueryClient();

  const handleLogout = (): void => {
    queryClient.clear();
    // signOut(auth);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Settings',
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
              <TextView>Settings</TextView>
            </Center>
          )}
        />
      </SafeAreaView>
    </>
  );
}


interface UserItem {
  user: IGetBasicUserProfile,
  onPress: () => void;
}
const UserItem: FC<UserItem> = ({ user, onPress }) => {
  return (
    <RectButton
      style={styles.eventItem}
      onPress={() => onPress()}
    >
      <Image
        style={{ width: 42, height: 42, borderRadius: 100 }}
        source={{
          thumbhash: user.photos[0]?.placeholder,
          uri: user.photos[0]?.url ?? defaultImgPlaceholder
        }}
      />

      <TextView
        ellipsis={true}
        style={{
          flex: 1,
        }}
      >
        {user.username}
      </TextView>

    </RectButton>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%'
  }
});
