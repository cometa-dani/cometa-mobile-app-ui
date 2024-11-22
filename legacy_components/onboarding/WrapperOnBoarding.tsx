/* eslint-disable react-native/no-unused-styles */
import { View } from '../Themed';
import { FC } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';


interface Props {
  children: React.ReactNode
}

export const AppWrapperOnBoarding: FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={onBoardingStyles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};


export const onBoardingStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    gap: 34,
    justifyContent: 'center',
    padding: 26
  },

  logo: {
    aspectRatio: 1,
    height: 70,
  }
});
