import { FC } from 'react';
import { FlexStyle, View } from 'react-native';


interface HStackProps {
  children: React.ReactNode;
  h?: FlexStyle['justifyContent'],
  v?: FlexStyle['alignItems'],
  styles?: FlexStyle,
  gap?: number,
}

export const HStack: FC<HStackProps> = ({ children, h, v, gap, styles = {} }) => {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: h, alignItems: v, gap }, styles]}>
      {children}
    </View>
  );
};


export const VStack: FC<HStackProps> = ({ children, h, v, gap, styles }) => {
  return (
    <View style={[{ flexDirection: 'column', justifyContent: h, alignItems: v, gap }, styles]}>
      {children}
    </View>
  );
};


export const Center: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </View>
  );
};
