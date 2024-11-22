import { GradientHeading } from '@/components/text/gradientText';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function OnboardingScreen() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <>
      <StatusBar
        style='inverted'
      />
      <Stack.Screen
        options={{ animation: 'slide_from_right' }}
      />
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
              <Pressable style={({ pressed }) => styles.buttonRed(pressed)}>
                {({ pressed, hovered }) => (
                  <Text style={styles.buttonRedText(pressed)}>
                    Login
                  </Text>
                )}
              </Pressable>
              <Pressable style={({ pressed }) => styles.buttonRedAlt(pressed)}>
                {({ pressed, hovered }) => (
                  <Text style={styles.buttonRedAltText(pressed)}>
                    Register
                  </Text>
                )}
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient >
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
    width: '100%',
    padding: theme.spacing.xl,
    marginTop: 80,
    gap: theme.spacing.md
  },
  buttonRedText: (pressed: boolean) => ({
    textAlign: 'center',
    color: theme.colors.white100,
    fontFamily: theme.text.fontSemibold,
    animationTimingFunction: 'ease-in-out',
    transform: [
      {
        scale: pressed ? 0.98 : 1
      }
    ]
  }),
  buttonRed: (pressed: boolean) => ({
    width: '100%',
    backgroundColor: pressed ? theme.colors.red80 : theme.colors.red100,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: pressed ? theme.colors.red100 : theme.colors.red90,
    shadowColor: theme.colors.red100,
    shadowOpacity: pressed ? 0 : 0.4,
    shadowOffset: pressed ? { width: 0, height: 3 } : undefined,
    shadowRadius: 3,
    elevation: pressed ? 0 : 2.5,
    animationTimingFunction: 'ease-in-out',
    transform: [
      {
        translateY: pressed ? 1 : 0,
      },
      {
        scale: pressed ? 0.99 : 1
      }
    ],
  }),
  buttonRedAlt: (pressed: boolean) => ({
    width: '100%',
    backgroundColor: pressed ? theme.colors.white90 : theme.colors.white100,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: pressed ? theme.colors.red90 : theme.colors.red100,
    shadowColor: theme.colors.red100,
    shadowOpacity: pressed ? 0 : 0.2,
    shadowOffset: pressed ? { width: 0, height: 3 } : undefined,
    shadowRadius: 2,
    elevation: pressed ? 0 : 2.5,
    animationTimingFunction: 'ease-in-out',
    transform: [
      {
        translateY: pressed ? 1 : 0,
      },
      {
        scale: pressed ? 0.99 : 1
      }
    ],
  }),
  buttonRedAltText: (pressed: boolean) => ({
    textAlign: 'center',
    color: theme.colors.red100,
    fontFamily: theme.text.fontSemibold,
    animationTimingFunction: 'ease-in-out',
    transform: [
      {
        scale: pressed ? 0.98 : 1
      }
    ]
  }),
}));
