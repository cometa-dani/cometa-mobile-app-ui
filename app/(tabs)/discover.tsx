import { StyleSheet } from 'react-native';
// import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';



export default function Discover() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Details</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
