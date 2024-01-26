import { FC, ReactNode } from 'react';
import { View, ViewProps } from '../Themed';
import { StyleSheet } from 'react-native';


interface CoProps extends ViewProps {
  children: ReactNode
}

export const AppCard: FC<CoProps> = ({ children, ...props }) => {
  const { style: otherStyles = {}, ...otherProps } = props;

  return (
    <View style={[styles.cardWrapper, otherStyles]} {...otherProps}>
      {children}
    </View>
  );
};


const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 18,
    elevation: 3,
    padding: 20,
    // paddingHorizontal: 24,
    // paddingVertical: 12,
    shadowColor: '#171717', // add shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  }
});
