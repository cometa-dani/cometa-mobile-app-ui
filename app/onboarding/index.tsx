import { GradientHeading } from '@/components/text/gradientText';
import { buttonsStyleSheet } from '@/styles/buttonsStyles';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function OnboardingScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { styles: buttonsStyles } = useStyles(buttonsStyleSheet);
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
              <Pressable
                onPress={() => console.log('Login')}
                style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
              >
                {({ pressed }) => (
                  <Text style={buttonsStyles.buttonRedText(pressed)}>
                    Login
                  </Text>
                )}
              </Pressable>
              <Pressable
                style={({ pressed }) => buttonsStyles.buttonRedAlt(pressed)}
              >
                {({ pressed }) => (
                  <Text style={buttonsStyles.buttonRedAltText(pressed)}>
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
    width: '100%',
    padding: theme.spacing.xl,
    marginTop: 80,
    gap: theme.spacing.md
  }
}));
