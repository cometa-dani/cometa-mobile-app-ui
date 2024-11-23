import { GradientHeading } from '@/components/text/gradientText';
import { buttonsStyleSheet } from '@/styles/buttonsStyles';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Modal from 'react-native-modal';
import { useReducer, useRef } from 'react';
import { HStack, VStack } from '@/components/utils/stacks';
import { AntDesign } from '@expo/vector-icons';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BottomSheet } from '@/components/onboarding/bottomSheet';


export default function OnboardingScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet);
  const [isUserProfileModalVisible, setUserProfileModalVisible] = useReducer(prev => !prev, false);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const toggleLoginModal = (): void => { };

  const toggleRegisterModal = (): void => {
    setUserProfileModalVisible();
  };

  const openUserProfileBottomSheet = (): void => {
    setUserProfileModalVisible();
    setTimeout(() => bottomSheetRef?.current?.expand(), 240);
    // bottomSheetRef?.current?.snapToIndex(1)
  };

  const openCompanyProfileModal = (): void => { };

  return (
    <>
      <StatusBar
        style='inverted'
      />

      <Modal
        backdropColor={theme.colors.backDrop}
        animationOutTiming={300}
        isVisible={isUserProfileModalVisible}
        onBackdropPress={setUserProfileModalVisible}
        style={{ justifyContent: 'flex-end' }}
      >
        <SafeAreaView>
          <View style={styles.modal}>
            <HStack h='space-between' v='center'>
              <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />
              <TouchableOpacity
                onPress={setUserProfileModalVisible}
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
                onPress={openUserProfileBottomSheet}
                style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
              >
                {({ pressed }) => (
                  <Text style={buttonsStyles.buttonRedText(pressed)}>
                    User Profile
                  </Text>
                )}
              </Pressable>
              <Pressable
                onPress={openCompanyProfileModal}
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
                  onPress={toggleLoginModal}
                  style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
                >
                  {({ pressed }) => (
                    <Text style={buttonsStyles.buttonRedText(pressed)}>
                      Login
                    </Text>
                  )}
                </Pressable>
                <Pressable
                  onPress={toggleRegisterModal}
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
        ref={bottomSheetRef}
      />
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
