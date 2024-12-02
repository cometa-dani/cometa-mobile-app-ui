import { FC } from 'react';
import { FlexStyle, StyleProp, View, ViewStyle } from 'react-native';


interface IHStackProps {
  children: React.ReactNode;
  $x?: FlexStyle['justifyContent'],
  $y?: FlexStyle['alignItems'],
  styles?: StyleProp<ViewStyle>,
  gap?: number,
}

export const HStack: FC<IHStackProps> = ({ children, $x, $y, gap, styles = {} }) => {
  return (
    <View style={[
      { flexDirection: 'row', justifyContent: $x, alignItems: $y, gap },
      styles
    ]}>
      {children}
    </View>
  );
};


interface IVStackProps {
  children: React.ReactNode;
  $x?: FlexStyle['alignItems'],
  $y?: FlexStyle['justifyContent'],
  styles?: StyleProp<ViewStyle>,
  gap?: number
}
export const VStack: FC<IVStackProps> = ({ children, $x, $y, gap, styles }) => {
  return (
    <View style={[
      { flexDirection: 'column', justifyContent: $y, alignItems: $x, gap },
      styles
    ]}>
      {children}
    </View>
  );
};


export const Center: FC<Omit<IHStackProps, 'h' | 'v'>> = ({ children, styles }) => {
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, styles]}>
      {children}
    </View>
  );
};
