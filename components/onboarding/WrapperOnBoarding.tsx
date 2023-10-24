import { View } from '../Themed';
import { FC } from 'react';
import { StyleSheet } from 'react-native';


interface Props {
  children: React.ReactNode
}

export const WrapperOnBoarding: FC<Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
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
