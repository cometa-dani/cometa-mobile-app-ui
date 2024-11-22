/* eslint-disable react-native/no-raw-text */
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { GradientText } from 'universal-gradient-text';


export default function OnboardingScreen() {
  const { styles } = useStyles(stylesheet);
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
              <GradientText
                style={{ fontFamily: 'PoppinsSemibold', fontSize: 36, textAlign: 'center' }}
                colors={['#5ac8fa', '#449dd1', '#c2354a', '#EA385C']}
                direction="ltr"
              >
                cometa
              </GradientText>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)', '#ffffff']}
          style={styles.linearGradient}
        >
          <SafeAreaView>
            <View style={styles.buttonsContainer}>
              <Pressable style={({ pressed, hovered }) => styles.buttonRed}>
                {({ pressed, hovered }) => (
                  <Text style={styles.buttonRedText}>
                    Login
                  </Text>
                )}
              </Pressable>
              <Pressable style={({ pressed, hovered }) => styles.buttonRedAlt}>
                {({ pressed, hovered }) => (
                  <Text style={styles.buttonRedAltText}>
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
  buttonRedText: {
    textAlign: 'center',
    color: theme.colors.white50,
    fontFamily: theme.text.fontSemibold
  },
  buttonRed: {
    width: '100%',
    backgroundColor: theme.colors.red100,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xs
  },
  buttonRedAlt: {
    width: '100%',
    backgroundColor: theme.colors.white50,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xs,
    borderWidth: 1.2,
    borderColor: theme.colors.red100
  },
  buttonRedAltText: {
    textAlign: 'center',
    color: theme.colors.red100,
    fontFamily: theme.text.fontSemibold
  }
}));
