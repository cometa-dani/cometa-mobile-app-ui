import { GradientHeading } from '@/components/text/gradientText';
import { buttonsStyleSheet } from '@/styles/buttonsStyles';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Modal from 'react-native-modal';
import { useReducer } from 'react';
import { HStack, VStack } from '@/components/utils/utils';
import { AntDesign } from '@expo/vector-icons';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';


export default function OnboardingScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet);
  const [isModalVisible, setModalVisible] = useReducer(prev => !prev, false);

  const handleLogin = (): void => { };

  const handleRegister = (): void => {
    setModalVisible();
  };

  const handleUserProfile = (): void => { };

  const handleCompanyProfile = (): void => { };


  return (
    <>
      <StatusBar
        style='inverted'
      />

      <Modal
        backdropColor='rgba(0,0,0,0.7)'
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
          colors={['rgba(0,0,0,0.72)', 'rgba(0,0,0,0.53)', 'transparent']}
          style={styles.linearGradientTop}
        >
          <SafeAreaView>
            <View style={{ top: 50 }}>
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
        </LinearGradient >
      </ImageBackground>
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
    height: 280,
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
