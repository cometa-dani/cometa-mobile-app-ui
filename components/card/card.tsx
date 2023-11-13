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
    elevation: 4,
    padding: 20,
    // paddingHorizontal: 24,
    // paddingVertical: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  }
});
