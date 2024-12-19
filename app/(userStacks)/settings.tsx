import { FC, ReactNode, useState } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { RectButton, } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { defaultImgPlaceholder } from '../../constants/vars';
import { IGetBasicUserProfile, IUserOnboarding } from '../../models/User';
import { TextView } from '@/components/text/text';
import { HStack, VStack } from '@/components/utils/stacks';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useQueryClient } from '@tanstack/react-query';
import { Heading } from '@/components/text/heading';
import { FieldText } from '@/components/input/textField';
import { testIds } from '@/components/onboarding/user/steps/components/testIds';
import { errorMessages } from '@/components/onboarding/user/steps/createYourProfile';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from '@/components/button/button';
import { SelectField } from '@/components/input/selectField';


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
  const [toggleNotification, setToggleNotification] = useState(true);

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
          contentContainerStyle={{
            gap: theme.spacing.sp10,
            padding: theme.spacing.sp10
          }}
          style={{
            backgroundColor: theme.colors.white100
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

            <SelectField
              initialValue='eng'
              options={[
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
                value={toggleNotification}
                onValueChange={setToggleNotification}
                thumbColor={theme.colors.slate75}
                trackColor={{ true: theme.colors.blue100 }}
              />
            </HStack>

            <SelectField
              initialValue='light'
              options={[
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
