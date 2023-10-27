import { ImageBackground, StyleSheet, View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { LightButton } from '../components/buttons/LightButton';
import { useEffect } from 'react';
import { Unsubscribe, onAuthStateChanged } from 'firebase/auth'; // Import Firebase authentication functions.
import { auth } from '../firebase/firebase'; // Import Firebase authentication instance.
import { useCometaStore } from '../store/cometaStore';


export default function WelcomeScreen(): JSX.Element {
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  let unsubscribe!: Unsubscribe;

  // Function to handle navigation when "Get Started" button is pressed.
  const handleSlideNextScreen = (): void => {
    unsubscribe && unsubscribe();
    router.push(isAuthenticated ? '/(app)/' : '/(onboarding)/login');
  };

  // Function to handle authentication state changes.
  const handleAuthStateChanged = async (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          console.log(`${user.email} isAuthenticated`);
          resolve(true);
        } else {
          setIsAuthenticated(false);
          resolve(false);
        }
      });
    });
  };

  // useEffect hook to perform actions when the component is mounted.
  useEffect(() => {
    // Use Promise.all to wait for multiple asynchronous operations.
    Promise.all([
      handleAuthStateChanged(), // Check if the user is authenticated.
      new Promise<void>((resolve) => setTimeout(() => resolve(), 2_400)) // Simulate a delay.
    ])
      .then((res) => {
        const [isAuthenticated] = res;
        if (isAuthenticated) {
          router.push('/(app)/'); // automatically Navigate to the app if the user is authenticated.
        }
      });

    return () => unsubscribe && unsubscribe();
  }, []); // The empty dependency array ensures this code runs only once, like componentDidMount.


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

// Styles for the WelcomeScreen component.
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
  }
});
