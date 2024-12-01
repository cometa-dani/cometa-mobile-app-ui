import { GradientHeading } from '@/components/text/gradientText';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useReducer } from 'react';
import { HStack, VStack } from '@/components/utils/stacks';
import { Button } from '@/components/button/button';
import { AntDesign } from '@expo/vector-icons';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import { Stack, useRouter } from 'expo-router';


export default function OnboardingScreen() {
  const router = useRouter();
  const { styles, theme } = useStyles(stylesheet);
  const [isUserProfileModalVisible, setUserProfileModalVisible] = useReducer(prev => !prev, false);

  const toggleLoginModal = (): void => { };

  const toggleRegisterModal = (): void => {
    setUserProfileModalVisible();
  };

  const openUserProfileBottomSheet = (): void => {
    setUserProfileModalVisible();
    router.push('/onboarding/(modal)/user');
  };

  const openCompanyProfileModal = (): void => { };

  return (
    <>
      <StatusBar style='inverted' />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTitle: '',
        }}
      />
      <Modal
        transparent={true}
        visible={isUserProfileModalVisible}
        animationType='fade'
        onRequestClose={setUserProfileModalVisible}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <HStack $x='space-between' $y='center'>
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
              <Button variant='primary' onPress={openUserProfileBottomSheet}>
                User Profile
              </Button>
              <Button variant='secondary-alt' onPress={openCompanyProfileModal}>
                Company Profile
              </Button>
            </VStack>
          </View>
        </View>
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
              <GradientHeading styles={{ fontSize: theme.text.size.s14 }}>
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
                <Button variant='primary' onPress={toggleLoginModal}>
                  Login
                </Button>
                <Button variant='primary-alt' onPress={toggleRegisterModal}>
                  Register
                </Button>
              </VStack>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}


const stylesheet = createStyleSheet((theme, runtime) => ({
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
    height: 270,
    width: '100%',
    justifyContent: 'flex-end'
  },
  buttonsContainer: {
    padding: theme.spacing.sp10,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.sp16 : theme.spacing.sp22
  },
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.backDrop,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing.sp6,
    paddingBottom: runtime.insets.bottom,
  },
  modal: {
    width: '100%',
    backgroundColor: theme.colors.white100,
    padding: theme.spacing.sp10,
    borderRadius: theme.radius.md,
    minHeight: 300,
  },
  logo: {
    width: 48,
    aspectRatio: 1
  }
}));
