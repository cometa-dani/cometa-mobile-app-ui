/* eslint-disable react-native/no-raw-text */
import { FC } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { GradientText } from 'universal-gradient-text';


interface Props {
  children?: string;
  styles?: StyleProp<TextStyle>
}

export const GradientHeading: FC<Props> = ({ children, styles = {} }) => {
  return (
    <GradientText
      style={[{ fontFamily: 'PoppinsSemibold', textAlign: 'center' }, styles]}
      colors={['#5ac8fa', '#449dd1', '#c2354a', '#EA385C']}
      direction="ltr"
    >
      {children}
    </GradientText>
  );
};
