import { GradientHeading } from '@/components/text/gradientText';
import { buttonsStyleSheet } from '@/styles/buttonsStyles';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import Modal from 'react-native-modal';
import { useCallback, useReducer, useRef, useState } from 'react';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput, BottomSheetView, } from '@gorhom/bottom-sheet';
import { ProgressBar } from '@/components/progressBar/progressBar';
import { useCometaStore } from '@/store/cometaStore';
import { Formik } from 'formik';

const snapPoints = ['50%', '78%'];

export default function OnboardingScreen() {
  const setOnboardingState = useCometaStore(state => state.setOnboarding);
  const onboardingState = useCometaStore(state => state.onboarding.user);
  const { styles, theme } = useStyles(stylesheet);
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet);
  const { styles: inputStyles } = useStyles(inputSheet);
  const [isModalVisible, setModalVisible] = useReducer(prev => !prev, false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleNext = (): void => { };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleLogin = (): void => { };

  const handleRegister = (): void => {
    setModalVisible();
  };

  const handleUserProfile = (): void => {
    setModalVisible();
    setTimeout(() => bottomSheetRef.current?.expand(), 200);
  };

  const handleCompanyProfile = (): void => { };

  // input
  const [isFocused, setIsFocused] = useState(false);
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
              gap={theme.spacing.lg}
              styles={{ marginTop: theme.spacing.xl }}
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
              <VStack gap={theme.spacing.lg}>
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
        keyboardBehavior="fillParent"
        snapPoints={snapPoints}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <BottomSheetView>
            <ProgressBar value={20} />
            <BottomSheetView>
              <Center styles={{ paddingVertical: theme.spacing.md }}>
                <Heading size='lg'>Create Your Profile</Heading>
              </Center>
            </BottomSheetView>
          </BottomSheetView>
          <BottomSheetScrollView style={{ paddingBottom: 100 }}>
            <Formik
              initialValues={onboardingState}
              validationSchema={{}}
              onSubmit={() => undefined}
            >
              {({ values, touched, errors }) => (
                <VStack>
                  <VStack styles={inputStyles.fiedContainer}>
                    <View style={inputStyles.fieldLabel}>
                      <Text style={inputStyles.fieldTextLabel}>
                        Full Name
                      </Text>
                    </View>
                    <FontAwesome
                      style={inputStyles.fieldIcon}
                      name="user"
                      size={theme.icons.lg}
                      color={isFocused ? theme.colors.blue100 : theme.colors.gray300}
                    />
                    <BottomSheetTextInput
                      style={inputStyles.field(isFocused)}
                      // secureTextEntry={true}
                      // editable={true}
                      placeholder='Full Name'
                      keyboardType='default'
                      value={values.name}
                      onChangeText={text => console.log(text)}
                      onBlur={() => setIsFocused(false)}
                      onFocus={() => setIsFocused(true)}
                    />
                  </VStack>
                  {/* {touched.name && errors.name && (
                    // <AppLabelFeedbackMsg position='bottom' text={errors.email} />
                  )} */}
                  <Text style={inputStyles.fieldTextError}>{errors.name ?? 'Name is required in this field'}</Text>
                  {/* {!isTyping && !isFetching && values.email.includes('@') && !errors.email && !isAvaibleToUse && (
                // <AppLabelFeedbackMsg position='bottom' text='your email already exists' />
              )}
              {!isTyping && !isFetching && values.email.includes('@') && !errors.email && isAvaibleToUse && (
                <AppLabelMsgOk position='bottom' text='email is available to use' />
              )} */}
                </VStack>

              )}
            </Formik>
          </BottomSheetScrollView>
          <BottomSheetView
            style={{ paddingBottom: UnistylesRuntime.insets.bottom }}
          >
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
            >
              {({ pressed }) => (
                <Text style={buttonsStyles.buttonRedText(pressed)}>
                  Next
                </Text>
              )}
            </Pressable>
          </BottomSheetView>
        </SafeAreaView>
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
    padding: theme.spacing.xl,
    marginTop: 80,
  },
  modal: {
    backgroundColor: theme.colors.white100,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    minHeight: 300
  },
  logo: {
    width: 48,
    aspectRatio: 1
  }
}));


const inputSheet = createStyleSheet((theme) => ({

  fieldTextError: {
    color: theme.colors.red100,
    fontFamily: theme.text.fontRegular,
    fontSize: theme.text.size.sm,
    opacity: 0.8,
    paddingVertical: theme.spacing.xs
  },

  fiedContainer: {
    position: 'relative',
    justifyContent: 'center'
  },
  fieldLabel: {
    position: 'absolute',
    zIndex: 1,
    left: 59,
    top: 6
  },
  fieldTextLabel: {
    fontSize: theme.text.size.xs,
    color: theme.colors.gray300,
    fontFamily: theme.text.fontMedium
  },
  fieldIcon: {
    position: 'absolute',
    zIndex: 1,
    left: 16,
    borderRightColor: theme.colors.gray200,
    borderRightWidth: 1,
    paddingVertical: 3,
    paddingRight: theme.spacing.md
  },
  field: (isFocused: boolean) => ({
    backgroundColor: theme.colors.white80,
    paddingHorizontal: theme.spacing.lg,
    paddingLeft: 59,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    borderRadius: theme.radius.sm,
    fontFamily: theme.text.fontMedium,
    borderWidth: 1.6,
    borderColor: isFocused ? theme.colors.blue100 : 'transparent',
    shadowColor: isFocused ? theme.colors.blue100 : undefined,
    shadowOpacity: isFocused ? 0.18 : 0,
    shadowOffset: isFocused ? { width: 0, height: 3 } : undefined,
    shadowRadius: isFocused ? 2 : 0,
    elevation: isFocused ? 1 : 0,
    animationTimingFunction: 'ease-in-out',
  })
}));
