import { ImageBackground, StyleSheet, View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { LightButton } from '../components/buttons/LightButton';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';


export default function WelcomeScreen(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSlideNextScreen = (): void => {
    router.push(isAuthenticated ? '/(app)/' : '/(onboarding)/login');
  };

  const handleAuthStateChanged = async () => {
    return new Promise<boolean>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          console.log(`${user.email} isAuthenticated`);
          resolve(true);
        }
        else {
          setIsAuthenticated(false);
          resolve(false);
        }
      });
    });
  };

  useEffect(() => {
    Promise.all([
      handleAuthStateChanged(),
      new Promise<void>((resolve) => setTimeout(() => resolve(), 2_000))
    ])
      .then((res) => {
        const [isAuthenticated] = res;
        if (isAuthenticated) {
          router.push('/(app)/');
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

      <LightButton
        onPress={() => handleSlideNextScreen()}
        text='get started'
      />
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
    height: 76
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    width: '100%'
  },
});
