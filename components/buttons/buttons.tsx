import { FC } from 'react';
import { Pressable, PressableProps, Text, StyleSheet, TextStyle } from 'react-native';
import { useColors } from '../Themed';
import { buttonColors } from '../../constants/colors';


interface Props extends PressableProps {
  text: string
  textStyles?: TextStyle
}

export const LightButton: FC<Props> = ({ text, textStyles = {}, ...props }) => {
  const { background } = useColors();

  return (
    <Pressable {...props} style={[styles.button, { backgroundColor: background }]}>
      <Text style={[styles.buttonText, textStyles]}>{text}</Text>
    </Pressable>
  );
};


interface CoProps extends PressableProps {
  text: string,
  btnColor: 'black' | 'gray' | 'blue' | 'white' | 'primary',
}

export const CoButton: FC<CoProps> = ({ text, btnColor, ...props }) => {
  const { background, color } = buttonColors[btnColor];
  return (
    <Pressable {...props} style={[styles.button, { backgroundColor: background }]}>
      <Text style={[styles.buttonText, { color }]}>{text}</Text>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    elevation: 2,
    minWidth: 130,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  buttonText: {
    color: '#6c6c6c',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    // textTransform: 'uppercase'
  },
});
