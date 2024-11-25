import { FC } from 'react';
import { FlexStyle, View } from 'react-native';


interface IStackProps {
  children: React.ReactNode;
  $x?: FlexStyle['justifyContent'],
  $y?: FlexStyle['alignItems'],
  styles?: FlexStyle,
  gap?: number,
}

export const HStack: FC<IStackProps> = ({ children, $x: h, $y: v, gap, styles = {} }) => {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: h, alignItems: v, gap }, styles]}>
      {children}
    </View>
  );
};


export const VStack: FC<IStackProps> = ({ children, $x: h, $y: v, gap, styles }) => {
  return (
    <View style={[{ flexDirection: 'column', justifyContent: h, alignItems: v, gap }, styles]}>
      {children}
    </View>
  );
};


export const Center: FC<Omit<IStackProps, 'h' | 'v'>> = ({ children, styles }) => {
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, styles]}>
      {children}
    </View>
  );
};
