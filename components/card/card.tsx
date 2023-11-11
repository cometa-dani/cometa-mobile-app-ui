import { FC, ReactNode } from 'react';
import { View } from '../Themed';
import { StyleSheet } from 'react-native';


interface CoProps {
  children: ReactNode
}

export const CoCard: FC<CoProps> = ({ children }) => {
  return (
    <View style={styles.cardWrapper}>
      {children}
    </View>
  );
};


const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 18,
    elevation: 2,
    padding: 20,
    // paddingHorizontal: 24,
    // paddingVertical: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  }
});
