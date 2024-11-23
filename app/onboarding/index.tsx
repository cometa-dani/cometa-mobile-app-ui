import { GradientHeading } from '@/components/text/gradientText';
import { buttonsStyleSheet } from '@/styles/buttonsStyles';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import Modal from 'react-native-modal';
import { useCallback, useReducer, useRef } from 'react';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { AntDesign } from '@expo/vector-icons';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import BottomSheet, { BottomSheetScrollView, BottomSheetView, } from '@gorhom/bottom-sheet';
import { ProgressBar } from '@/components/progressBar/progressBar';
import { useCometaStore } from '@/store/cometaStore';
import { Formik, FormikHelpers } from 'formik';
import { IUserClientState } from '@/models/User';
import { FieldText } from '@/components/input/fieldText';

const snapPoints = ['50%', '78%', '100%'];

export default function OnboardingScreen() {
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const onboardingState = useCometaStore(state => state.onboarding.user);
  const { styles, theme } = useStyles(stylesheet);
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet);
  const [isModalVisible, setModalVisible] = useReducer(prev => !prev, false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleNext = (values: IUserClientState, actions: FormikHelpers<IUserClientState>): void => {
    setOnboardingState(values);
    console.log('handleNext', values);
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleLogin = (): void => { };

  const handleRegister = (): void => {
    setModalVisible();
  };

  const handleUserProfile = (): void => {
    setModalVisible();
    setTimeout(() => bottomSheetRef.current?.snapToIndex(1), 200);
  };

  const handleCompanyProfile = (): void => { };

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
              <Heading size='lg'>
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
          colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.58)', 'transparent']}
          style={styles.linearGradientTop}
        >
          <SafeAreaView>
            <View style={{ top: 60 }}>
              <GradientHeading
                styles={{ fontSize: theme.text.size.xxxl }}
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
              <VStack gap={theme.spacing.sp6}>
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
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        keyboardBehavior="extend"
        snapPoints={snapPoints}
      >
        <Formik
          initialValues={onboardingState}
          // validationSchema={{}}
          onSubmit={handleNext}
        >
          {({ handleSubmit }) => (
            <SafeAreaView style={{ flex: 1 }}>
              <BottomSheetView>
                <ProgressBar value={20} />
                <BottomSheetView>
                  <Center styles={{ paddingTop: theme.spacing.sp10 }}>
                    <Heading size='lg'>Create Your Profile</Heading>
                  </Center>
                </BottomSheetView>
              </BottomSheetView>
              <BottomSheetScrollView
                contentContainerStyle={{
                  padding: theme.spacing.sp8,
                  gap: theme.spacing.sp6
                }}>
                <FieldText
                  label='Full Name'
                  name='name'
                  placeholder='Full Name'
                  iconName='user'
                />
                <FieldText
                  label='User Name'
                  name='username'
                  placeholder='User Name'
                  iconName='at'
                />
                <FieldText
                  label='Birthday'
                  name='birthday'
                  placeholder='Enter your birthday'
                  iconName='calendar-check-o'
                />
                <FieldText
                  label='Email'
                  name='email'
                  placeholder='Email'
                  iconName='envelope'
                  keyboardType='email-address'
                />
                <FieldText
                  secureTextEntry={true}
                  label='Password'
                  name='password'
                  placeholder='Enter your password'
                  iconName='lock'
                />
                <FieldText
                  secureTextEntry={true}
                  label='Re-enter Password'
                  name='repassword'
                  placeholder='Enter your password again'
                  iconName='lock'
                />
                <View
                  style={{ paddingBottom: UnistylesRuntime.insets.bottom }}
                >
                  <Pressable
                    onPress={() => handleSubmit()}
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
          )}
        </Formik>
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
    height: 300,
    width: '100%'
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    height: 300,
    width: '100%'
  },
  buttonsContainer: {
    padding: theme.spacing.sp8,
    marginTop: 80,
  },
  modal: {
    backgroundColor: theme.colors.white100,
    padding: theme.spacing.sp8,
    borderRadius: theme.radius.md,
    minHeight: 300
  },
  logo: {
    width: 48,
    aspectRatio: 1
  }
}));
