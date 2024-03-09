import { ImageBackground, StyleSheet, View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { LightButton } from '../components/buttons/buttons';
import { useEffect } from 'react';
import { Unsubscribe, onAuthStateChanged } from 'firebase/auth'; // Import Firebase authentication functions.
import { auth } from '../firebase/firebase'; // Import Firebase authentication instance.
import { useCometaStore } from '../store/cometaStore';


export default function WelcomeScreen(): JSX.Element {
  const isAuthenticated = useCometaStore(state => state.isAuthenticated);
  const setAccessToken = useCometaStore(state => state.setAccessToken);
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const setUserUid = useCometaStore(state => state.setUid);
  let unsubscribe!: Unsubscribe;

  // Function to handle navigation when "Get Started" button is pressed.
  const handleSlideNextScreen = (): void => {
    unsubscribe && unsubscribe();
    // router.push('/(onboarding)/whenIsYourBirthday');
    router.push(isAuthenticated ? '/(app)/' : '/(onboarding)/login');
  };

  // Function to handle authentication state changes.
  const handleAuthStateChanged = async (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            const accessToken = await user.getIdToken();
            // console.log(accessToken);
            setAccessToken(accessToken);
            setIsAuthenticated(true);
            setUserUid(user.uid);
            // console.log(user.uid);
            // console.log(`${user.email} is authenticated`);
            resolve(true);
          }
          else {
            setIsAuthenticated(false);
            // console.log('user is logged out');
            resolve(false);
          }
        }
        catch (error) {
          // console.log(error);
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
          unsubscribe && unsubscribe();
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
        onPress={handleSlideNextScreen}
        text='Get Started'
      />
    </ImageBackground>
  );
}

// Styles for the WelcomeScreen component.
const styles = StyleSheet.create({
  h1: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center'
  },

  h2: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    height: 70
  },

  textContainer: {
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    width: '100%'
  }
});
