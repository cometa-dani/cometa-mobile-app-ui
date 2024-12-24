import { ReactNode, useReducer, useState } from 'react';
import { Modal, Pressable, Switch, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IGetBasicUserProfile, IUserOnboarding } from '../../models/User';
import { TextView } from '@/components/text/text';
import { HStack, VStack } from '@/components/utils/stacks';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
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
import { supabase } from '@/supabase/config';
import { useMutationDeleteUser } from '@/queries/currentUser/userHooks';
import { QueryKeys } from '@/queries/queryKeys';
import { Notifier } from 'react-native-notifier';
import { ErrorToast, InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';


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
  const { styles, theme } = useStyles(styleSheet);
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteUser = useMutationDeleteUser();
  const formProps = useForm({
    defaultValues,
    resolver: yupResolver<IFormValues>(validationSchema),
  });
  const [toggleNotification, setToggleNotification] = useState(true);
  const [toggleDeleteModal, setToggleDeleteModal] = useReducer(prev => !prev, false);

  const handleLogout = async () => {
    const userProfile = queryClient.getQueryData<IGetBasicUserProfile>([QueryKeys.GET_LOGGED_IN_USER_PROFILE]);
    Notifier.showNotification({
      duration: 0,
      title: 'Logging out...',
      description: `Good bye ${userProfile?.name || ''} 👋`,
      Component: InfoToast,
    });
    try {
      await supabase.auth.signOut();
      queryClient.removeQueries();
      queryClient.clear();
      Notifier.hideNotification();
      router.replace('/welcome');
    } catch (error) {
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Error',
        description: 'there was an error, try again',
        Component: ErrorToast,
      });
    }
  };

  const handleDeleteUserProfile = async () => {
    queryClient.clear();
    const userProfile = queryClient.getQueryData<IGetBasicUserProfile>([QueryKeys.GET_LOGGED_IN_USER_PROFILE]);
    if (!userProfile?.id) return;
    Notifier.showNotification({
      duration: 0,
      title: 'Deleting...',
      description: 'your profile is being deleted',
      Component: InfoToast,
    });
    try {
      await deleteUser.mutateAsync(userProfile.id);
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Done',
        description: 'your profile was deleted successfully',
        Component: SucessToast,
      });
      router.replace('/welcome');
    } catch (error) {
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Error',
        description: 'there was an error deleting your profile',
        Component: ErrorToast,
      });
    }
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
              editable={false}
              testId={testIds.password}
              secureTextEntry={true}
              label='Password'
              name='password'
              placeholder='Enter your password'
              iconName='lock'
              defaultErrMessage={errorMessages.password}
            />
            <FieldText
              editable={false}
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
              disabled={true}
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
                disabled={true}
                value={toggleNotification}
                onValueChange={setToggleNotification}
                thumbColor={theme.colors.slate75}
                trackColor={{ true: theme.colors.blue100 }}
              />
            </HStack>

            <SelectField
              disabled={true}
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
            <Button variant='primary' onPress={handleLogout}>
              Log Out
            </Button>
            <Button variant='primary-alt' onPress={setToggleDeleteModal}>
              Delete Account
            </Button>
          </VStack>
        </KeyboardAwareScrollView>
      </FormProvider>

      <Modal
        transparent={true}
        visible={toggleDeleteModal}
        animationType='fade'
        statusBarTranslucent={true}
      >
        <Pressable onPress={setToggleDeleteModal} style={styles.backdrop}>
          <View style={styles.modal}>
            <VStack
              gap={theme.spacing.sp6}
              styles={{ marginTop: theme.spacing.sp8 }}
            >
              <Heading size='s6'>
                Do you want to delete your account?
              </Heading>
              <TextView>
                Once deleted, your account and personal data cannot be recovered.
              </TextView>
              <Button variant='primary' onPress={handleDeleteUserProfile}>
                Delete
              </Button>
              <Button variant='secondary-alt' onPress={setToggleDeleteModal}>
                Close
              </Button>
            </VStack>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.backDrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sp8,
  },
  modal: {
    width: '100%',
    backgroundColor: theme.colors.white100,
    padding: theme.spacing.sp10,
    borderRadius: theme.radius.md,
    minHeight: 300,
  },
}));
