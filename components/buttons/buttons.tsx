import { FC } from 'react';
import { Pressable, PressableProps, Text, StyleSheet, TextStyle } from 'react-native';
import { useColors } from '../Themed';


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

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    elevation: 3,
    paddingHorizontal: 28,
    paddingVertical: 14,
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
