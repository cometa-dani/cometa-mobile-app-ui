import { FC } from 'react';
import { Pressable, PressableProps, Text, StyleSheet } from 'react-native';
import { useColors } from '../Themed';


interface Props extends PressableProps {
  text: string
}

export const LightButton: FC<Props> = ({ text, ...props }) => {
  const { background } = useColors();
  return (
    <Pressable {...props} style={[styles.button, { backgroundColor: background }]}>
      <Text style={styles.buttonText}>{text}</Text>
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
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
});
