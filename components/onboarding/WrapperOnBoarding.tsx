import { View } from '../Themed';
import { FC } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';


interface Props {
  children: React.ReactNode
}

export const AppWrapperOnBoarding: FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    gap: 40,
    justifyContent: 'center',
    padding: 26
  },
});
