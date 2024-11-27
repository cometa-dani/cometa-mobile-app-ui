import { FC } from 'react';
import { useStyles } from 'react-native-unistyles';
import { FieldText } from '@/components/input/fieldText';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCometaStore } from '@/store/cometaStore';
import { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Center } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { Button } from '@/components/button/button';
import { IUserOnboarding } from '@/models/User';
import { Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { testIds } from './testIds';


const errorMessages = {
  email: 'Email is required',
  password: 'Password is required',
  repeatPassword: 'Verify Password again',
  name: 'Name is required',
  username: 'User Name is required',
  birthday: 'Birthday is required',
};

type IFormValues = Pick<IUserOnboarding, (
  'email' |
  'password' |
  'repassword' |
  'name' |
  'username' |
  'birthday'
)>

const validationSchema = Yup.object<IFormValues>().shape({
  email: Yup.string().email().required(errorMessages.email),
  password: Yup.string().min(6).max(18).required(errorMessages.password),
  repassword:
    Yup.string()
      .oneOf([Yup.ref('password'), ''])
      .required(errorMessages.repeatPassword),
  name: Yup.string().min(3).max(26).required(errorMessages.name),
  username: Yup.string().min(3).max(18).required(errorMessages.username),
  birthday: Yup.string().min(3).max(18).required(errorMessages.birthday),
});

const defaultValues: IFormValues = {
  email: '',
  password: '',
  repassword: '',
  name: '',
  username: '',
  birthday: '',
};

interface IProps {
  onNextStep: () => void;
}
export const CreateYourProfileForm: FC<IProps> = ({ onNextStep }) => {
  const formProps = useForm({ defaultValues, resolver: yupResolver<IFormValues>(validationSchema) });
  const { theme } = useStyles();
  return (
    <FormProvider
      {...formProps}
    >
      <BottomSheetView>
        <Center styles={{
          paddingTop: theme.spacing.sp12,
          paddingBottom: theme.spacing.sp2
        }}>
          <Heading size='s7'>Create Your Profile</Heading>
        </Center>
      </BottomSheetView>

      {Platform.select({
        android: (
          <BottomSheetScrollView

            // style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.sp10,
              paddingVertical: theme.spacing.sp8,
              gap: theme.spacing.sp7,
              // position: 'relative',
              // flex: 1,
              // flexGrow: 1
            }}>
            <FieldsList onNextStep={onNextStep} />
          </BottomSheetScrollView>
        ),
        ios: (
          // <KeyboardAwareScrollView
          // bottomOffset={110}
          <BottomSheetScrollView

            // style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.sp10,
              paddingVertical: theme.spacing.sp8,
              gap: theme.spacing.sp7,
              // position: 'relative',
              // flex: 1,
              // flexGrow: 1
            }}>
            <FieldsList onNextStep={onNextStep} />
          </BottomSheetScrollView>
          // </KeyboardAwareScrollView>
        )
      })}
    </FormProvider>
  );
};


interface IFormProps {
  onNextStep: () => void;
}
const FieldsList: FC<IFormProps> = ({ onNextStep }) => {
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const handleUserState = (values: IFormValues): void => {
    setOnboardingState(values);
    onNextStep();
  };
  const formProps = useFormContext<IFormValues>();
  const { theme } = useStyles();

  return (
    <>
      <FieldText
        isInsideBottomSheet={true}
        testId={testIds.fullname}
        label='Full Name'
        name='name'
        placeholder='Enter your Full Name'
        iconName='user'
        defaultErrMessage={errorMessages.name}
      />
      <FieldText
        isInsideBottomSheet={true}
        testId={testIds.username}
        label='User Name'
        name='username'
        placeholder='Enter your User Name'
        iconName='at'
        defaultErrMessage={errorMessages.username}
      />
      {/* <FieldText
        isInsideBottomSheet={true}
        isDateTimePicker={true}
        testId={testIds.birthday}
        label='Birthday'
        name='birthday'
        placeholder='Enter your birthday'
        iconName='calendar-check-o'
        editable={false}
        defaultErrMessage={errorMessages.birthday}
      /> */}
      <FieldText
        isInsideBottomSheet={true}
        testId={testIds.email}
        label='Email'
        name='email'
        placeholder='Enter your Email'
        iconName='envelope'
        keyboardType='email-address'
        defaultErrMessage={errorMessages.email}
      />
      <FieldText
        isInsideBottomSheet={true}
        testId={testIds.password}
        secureTextEntry={true}
        label='Password'
        name='password'
        placeholder='Enter your password'
        iconName='lock'
        defaultErrMessage={errorMessages.password}
      />
      <FieldText
        isInsideBottomSheet={true}
        testId={testIds.repeatPassword}
        secureTextEntry={true}
        label='Re-enter Password'
        name='repassword'
        placeholder='Enter your password again'
        iconName='lock'
        defaultErrMessage={errorMessages.repeatPassword}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Button
          style={{ marginTop: theme.spacing.sp8 }}
          isInsideBottomSheet={true}
          variant='primary'
          onPress={formProps.handleSubmit(handleUserState)}
        >
          Next
        </Button>
      </KeyboardAvoidingView>
    </>
  );
};
