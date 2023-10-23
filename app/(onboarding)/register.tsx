import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';


export default function RegisterScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/images/cometa-logo.png')} />
      <Text style={styles.title}>Sign Up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    aspectRatio: 1,
    height: 120
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
