import { ImageBackground, StyleSheet, View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { LightButton } from '../components/buttons/LightButton';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';


export default function WelcomeScreen(): JSX.Element {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // router.push('/(app)/');
      }
      else {
        // router.push('/(onboarding)/register');
      }
    });
  }, []);

  return (
    <ImageBackground style={styles.imageBackground} source={require('../assets/images/welcome-image.jpeg')}>
      <View style={styles.textContainer}>
        <Image style={styles.logo} source={require('../assets/images/cometa-logo.png')} />
        <Text style={styles.h1}>Discover New Experiences</Text>

        <Text style={styles.h2}>Start exploring events near you and join like-minded people</Text>
      </View>

      <LightButton onPress={() => router.push('/(onboarding)/login')} text='get started' />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  h1: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center'
  },

  h2: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '500',
    maxWidth: 320,
    textAlign: 'center'
  },

  imageBackground: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 30
  },

  logo: {
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 80
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    width: '100%'
  },
});
