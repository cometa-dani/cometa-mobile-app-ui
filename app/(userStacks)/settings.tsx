import React, { FC, ReactNode, useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { RectButton, } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { defaultImgPlaceholder } from '../../constants/vars';
import { IGetBasicUserProfile, IUserOnboarding } from '../../models/User';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useQueryClient } from '@tanstack/react-query';
import { Heading } from '@/components/text/heading';
import { FieldText } from '@/components/input/textField';
import { testIds } from '@/components/onboarding/user/steps/components/testIds';
import { errorMessages } from '@/components/onboarding/user/steps/createYourProfile';
// import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/button/button';


export type IFormValues = Pick<IUserOnboarding, (
  'password' |
  'repassword'
)>

export const validationSchema = Yup.object<IFormValues>().shape({
  password: Yup.string().min(6).max(18).required(errorMessages.password),
  repassword:
    Yup.string()
      .oneOf([Yup.ref('password'), ''])
      .required(errorMessages.repeatPassword),

});

export const defaultValues: IFormValues = {
  password: '',
  repassword: '',
};

export default function SettingsScreen(): ReactNode {
  const { theme } = useStyles();
  const queryClient = useQueryClient();
  const formProps = useForm({
    defaultValues,
    resolver: yupResolver<IFormValues>(validationSchema),
  });
  const [selectedLanguage, setSelectedLanguage] = useState('');

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
      <FormProvider  {...formProps}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ gap: theme.spacing.sp8 }}
          style={{
            padding: theme.spacing.sp8,
            backgroundColor: theme.colors.white100,
          }}
        >
          <VStack gap={theme.spacing.sp4}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Account
            </Heading>

            <FieldText
              testId={testIds.password}
              secureTextEntry={true}
              label='Password'
              name='password'
              placeholder='Enter your password'
              iconName='lock'
              defaultErrMessage={errorMessages.password}
            />
            <FieldText
              testId={testIds.repeatPassword}
              secureTextEntry={true}
              label='Re-enter Password'
              name='repassword'
              placeholder='Enter your password again'
              iconName='lock'
              defaultErrMessage={errorMessages.repeatPassword}
            />
          </VStack>

          <VStack gap={theme.spacing.sp4}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Preferences
            </Heading>

            <RNPickerSelect
              style={{
                inputIOSContainer: { pointerEvents: 'none' },
                inputIOS: {
                  fontFamily: theme.text.fontRegular,
                  color: theme.colors.gray900
                },
                inputAndroid: {
                  fontFamily: theme.text.fontRegular,
                  color: theme.colors.gray900
                },
              }}
              pickerProps={{
                mode: 'dropdown',
                itemStyle: {
                  fontFamily: theme.text.fontRegular,
                  fontSize: theme.text.size.s4,
                  color: theme.colors.gray900
                },
              }}
              touchableWrapperProps={{
                style: {
                  backgroundColor: theme.colors.slate75,
                  paddingVertical: theme.spacing.sp7,
                  paddingHorizontal: theme.spacing.sp10,
                  borderRadius: theme.radius.sm,
                }
              }}
              placeholder={{
                label: 'Select a language',
                value: null,
                color: theme.colors.gray900
              }}
              value={'eng'}
              onValueChange={(value) => console.log(value)}
              items={[
                { label: 'English', value: 'eng' },
                { label: 'French', value: 'fr' },
                { label: 'Spanish', value: 'es' },
              ]}
            />
            <HStack
              $y='center'
              $x='space-between'
              styles={{
                paddingHorizontal: theme.spacing.sp8,
                paddingVertical: theme.spacing.sp2,
              }}>
              <HStack gap={theme.spacing.sp1}>
                <FontAwesome5
                  name="bell"
                  size={theme.spacing.sp10}
                  color={theme.colors.gray900}
                />
                <TextView>
                  Notification
                </TextView>
              </HStack>
              <Switch
                value={true}
                thumbColor={theme.colors.slate75}
                trackColor={{ true: theme.colors.blue100 }}
              />
            </HStack>
            <RNPickerSelect
              style={{
                inputIOSContainer: { pointerEvents: 'none' },
                inputIOS: {
                  fontFamily: theme.text.fontRegular,
                  color: theme.colors.gray900
                },
                inputAndroid: {
                  fontFamily: theme.text.fontRegular,
                  color: theme.colors.gray900
                },
              }}
              pickerProps={{
                mode: 'dropdown',
                itemStyle: {
                  fontFamily: theme.text.fontRegular,
                  fontSize: theme.text.size.s4,
                  color: theme.colors.gray900
                },
              }}
              touchableWrapperProps={{
                style: {
                  backgroundColor: theme.colors.slate75,
                  paddingVertical: theme.spacing.sp7,
                  paddingHorizontal: theme.spacing.sp10,
                  borderRadius: theme.radius.sm,
                }
              }}
              placeholder={{
                label: 'Select a theme',
                value: null,
                color: theme.colors.gray900
              }}
              value={'light'}
              onValueChange={(value) => console.log(value)}
              items={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ]}
            />
          </VStack>

          <VStack gap={theme.spacing.sp4}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Support
            </Heading>

            <HStack
              $y='center'
              $x='space-between'
              styles={{
                paddingHorizontal: theme.spacing.sp8,
                paddingVertical: theme.spacing.sp2,
              }}>
              <HStack gap={theme.spacing.sp1}>
                <FontAwesome5
                  name="question-circle"
                  size={theme.spacing.sp10}
                  color={theme.colors.gray900}
                />
                <TextView>
                  Help Center
                </TextView>
              </HStack>
            </HStack>
            <HStack
              $y='center'
              $x='space-between'
              styles={{
                paddingHorizontal: theme.spacing.sp8,
                paddingVertical: theme.spacing.sp2,
              }}>
              <HStack gap={theme.spacing.sp1}>
                <FontAwesome5
                  name="headset"
                  size={theme.spacing.sp10}
                  color={theme.colors.gray900}
                />
                <TextView>
                  Contact Us
                </TextView>
              </HStack>
            </HStack>
          </VStack>
          <VStack
            gap={theme.spacing.sp6}
            styles={{ marginBottom: UnistylesRuntime.insets.bottom }}
          >
            <Button variant='primary-alt' onPress={() => console.log('pressed')}>
              Delete Account
            </Button>
            <Button variant='primary' onPress={() => console.log('pressed')}>
              Logout
            </Button>
          </VStack>
        </KeyboardAwareScrollView>
      </FormProvider>
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
