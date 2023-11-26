import { FC } from 'react';
import { TextInputProps, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useColors } from '../Themed';


export const AppTextInput: FC<TextInputProps> = ({ ...props }) => {
  const { background: backgroundColor } = useColors();
  const { style, ...otherProps } = props;
  return (
    <TextInput {...otherProps} style={[styles.input, { backgroundColor }, style]} />
  );
};


const styles = StyleSheet.create({
  input: {
    borderRadius: 50,
    elevation: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  }
});