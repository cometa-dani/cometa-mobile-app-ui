import { GradientHeading } from '@/components/text/gradientText';
import { buttonsStyleSheet } from '@/styles/buttonsStyles';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import Modal from 'react-native-modal';
import { useReducer, useRef } from 'react';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { AntDesign } from '@expo/vector-icons';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import BottomSheet, { BottomSheetScrollView, BottomSheetView, } from '@gorhom/bottom-sheet';
import { ProgressBar } from '@/components/progressBar/progressBar';
import { useCometaStore } from '@/store/cometaStore';
import { FieldText } from '@/components/input/fieldText';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


const errorMessages = {
  email: 'Email is required',
  password: 'Password is required',
  repeatPassword: 'Verify Password again',
  name: 'Name is required',
  username: 'User Name is required',
  birthday: 'Birthday is required',
};

type FormValues = {
  email: string;
  password: string;
  repassword: string;
  name: string;
  username: string;
  birthday: string;
}

const validationSchema = Yup.object<FormValues>().shape({
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

const defaultValues: FormValues = {
  email: '',
  password: '',
  repassword: '',
  name: '',
  username: '',
  birthday: '',
};

const snapPoints = ['50%', '78%', '100%'];


export default function OnboardingScreen() {
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const { styles, theme } = useStyles(stylesheet);
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet);
  const [isModalVisible, setModalVisible] = useReducer(prev => !prev, false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const formProps = useForm<FormValues>({ defaultValues, resolver: yupResolver(validationSchema) });

  // callbacks
  const handleNext = (values: FormValues): void => {
    setOnboardingState(values);
    console.log('handleNext', values);
  };

  const handleLogin = (): void => { };

  const handleRegister = (): void => {
    setModalVisible();
  };

  const handleUserProfile = (): void => {
    setModalVisible();
    setTimeout(() => bottomSheetRef.current?.snapToIndex(1), 200);
  };

  const handleCompanyProfile = (): void => { };

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       bottomSheetRef.current?.expand();
  //     }
  //   );
  //   return () => {
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  return (
    <>
      <StatusBar
        style='inverted'
      />

      <Modal
        backdropColor={theme.colors.backDrop}
        animationOutTiming={300}
        isVisible={isModalVisible}
        onBackdropPress={setModalVisible}
        style={{ justifyContent: 'flex-end' }}
      >
        <SafeAreaView>
          <View style={styles.modal}>
            <HStack h='space-between' v='center'>
              <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />
              <TouchableOpacity
                onPress={setModalVisible}
              >
                <AntDesign name="closecircle" size={theme.icons.md} color={theme.colors.gray900} />
              </TouchableOpacity>
            </HStack>

            <VStack
              gap={theme.spacing.sp6}
              styles={{ marginTop: theme.spacing.sp8 }}
            >
              <Heading size='s6'>
                Join to Discover & Connect!
              </Heading>
              <TextView>
                Create you profile and start matching with others who share your bucket list goals
              </TextView>
              <Pressable
                onPress={handleUserProfile}
                style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
              >
                {({ pressed }) => (
                  <Text style={buttonsStyles.buttonRedText(pressed)}>
                    User Profile
                  </Text>
                )}
              </Pressable>
              <Pressable
                onPress={handleCompanyProfile}
                style={({ pressed }) => buttonsStyles.buttonBlueAlt(pressed)}
              >
                {({ pressed }) => (
                  <Text style={buttonsStyles.buttonBlueAltText(pressed)}>
                    Company Profile
                  </Text>
                )}
              </Pressable>
            </VStack>
          </View>
        </SafeAreaView>
      </Modal>

      <ImageBackground
        source={require('../../assets/images/welcome-image.jpeg')}
        contentFit='cover'
        style={styles.imgBackground}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.76)', 'rgba(0,0,0,0.6)', 'transparent']}
          style={styles.linearGradientTop}
        >
          <SafeAreaView>
            <View style={{ top: 60 }}>
              <GradientHeading
                styles={{ fontSize: theme.text.size.s14 }}
              >
                cometa
              </GradientHeading>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)', '#ffffff']}
          style={styles.linearGradient}
        >
          <SafeAreaView>
            <View style={styles.buttonsContainer}>
              <VStack gap={theme.spacing.sp8}>
                <Pressable
                  onPress={handleLogin}
                  style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
                >
                  {({ pressed }) => (
                    <Text style={buttonsStyles.buttonRedText(pressed)}>
                      Login
                    </Text>
                  )}
                </Pressable>
                <Pressable
                  onPress={handleRegister}
                  style={({ pressed }) => buttonsStyles.buttonRedAlt(pressed)}
                >
                  {({ pressed }) => (
                    <Text style={buttonsStyles.buttonRedAltText(pressed)}>
                      Register
                    </Text>
                  )}
                </Pressable>
              </VStack>
            </View>
          </SafeAreaView>
        </LinearGradient>

      </ImageBackground>

      <BottomSheet
        $modal={false}
        ref={bottomSheetRef}
        index={1}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        keyboardBehavior="extend"
        snapPoints={snapPoints}
      >
        <FormProvider
          {...formProps}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <BottomSheetView>
              <BottomSheetView style={{
                paddingTop: theme.spacing.sp2,
                paddingHorizontal: theme.spacing.sp10,
              }}>
                <ProgressBar value={50} />
              </BottomSheetView>
              <BottomSheetView>
                <Center styles={{
                  paddingTop: theme.spacing.sp12,
                  paddingBottom: theme.spacing.sp2
                }}>
                  <Heading size='s7'>Create Your Profile</Heading>
                </Center>
              </BottomSheetView>
            </BottomSheetView>
            <BottomSheetScrollView
              contentContainerStyle={{
                paddingVertical: theme.spacing.sp8,
                paddingHorizontal: theme.spacing.sp10,
                gap: theme.spacing.sp7
              }}>
              <FieldText
                label='Full Name'
                name='name'
                placeholder='Enter your Full Name'
                iconName='user'
                defaultErrMessage={errorMessages.name}
              />
              <FieldText
                label='User Name'
                name='username'
                placeholder='Enter your User Name'
                iconName='at'
                defaultErrMessage={errorMessages.username}
              />
              <FieldText
                label='Birthday'
                name='birthday'
                placeholder='Enter your birthday'
                iconName='calendar-check-o'
                defaultErrMessage={errorMessages.birthday}
              />
              <FieldText
                label='Email'
                name='email'
                placeholder='Enter your Email'
                iconName='envelope'
                keyboardType='email-address'
                defaultErrMessage={errorMessages.email}
              />
              <FieldText
                secureTextEntry={true}
                label='Password'
                name='password'
                placeholder='Enter your password'
                iconName='lock'
                defaultErrMessage={errorMessages.password}
              />
              <FieldText
                secureTextEntry={true}
                label='Re-enter Password'
                name='repassword'
                placeholder='Enter your password again'
                iconName='lock'
                defaultErrMessage={errorMessages.repeatPassword}
              />
              <View
                style={{ paddingBottom: UnistylesRuntime.insets.bottom }}
              >
                <Pressable
                  onPress={formProps.handleSubmit(handleNext)}
                  style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
                >
                  {({ pressed }) => (
                    <Text style={buttonsStyles.buttonRedText(pressed)}>
                      Next
                    </Text>
                  )}
                </Pressable>
              </View>
            </BottomSheetScrollView>
          </SafeAreaView>
        </FormProvider>
      </BottomSheet>
    </>
  );
}


const stylesheet = createStyleSheet((theme) => ({
  imgBackground: {
    flex: 1,
    position: 'relative',
  },
  linearGradientTop: {
    position: 'absolute',
    top: 0,
    height: 314,
    width: '100%'
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    height: 314,
    width: '100%',
    justifyContent: 'flex-end'
  },
  buttonsContainer: {
    padding: theme.spacing.sp10,
    paddingBottom: theme.spacing.sp16
  },
  modal: {
    backgroundColor: theme.colors.white100,
    padding: theme.spacing.sp10,
    borderRadius: theme.radius.md,
    minHeight: 300
  },
  logo: {
    width: 48,
    aspectRatio: 1
  }
}));
