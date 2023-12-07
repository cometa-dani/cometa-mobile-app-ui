import { FC, ReactNode } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useColors } from '../Themed';
import { buttonColors } from '../../constants/colors';
import { BaseButton, BaseButtonProps } from 'react-native-gesture-handler';


interface Props extends BaseButtonProps {
  text: string
  textStyles?: TextStyle
}
// TODO: remove this button is unnecesary and replace it with AppButton
export const LightButton: FC<Props> = ({ text, textStyles = {}, ...props }) => {
  const { background } = useColors();

  return (
    <BaseButton {...props} style={[styles.button, { backgroundColor: background }]}>
      <Text style={[styles.buttonText, textStyles]}>{text}</Text>
    </BaseButton>
  );
};


interface CoProps extends BaseButtonProps {
  text?: string,
  children?: ReactNode
  btnColor: 'black' | 'gray' | 'blue' | 'white' | 'primary',
}

export const AppButton: FC<CoProps> = ({ children, text, btnColor, ...props }) => {
  const { background, color } = buttonColors[btnColor];
  const { style, ...otherProps } = props;
  return (
    <BaseButton {...otherProps} style={[styles.button, { backgroundColor: background }, { ...style as object }]}>
      {text ? (
        <Text style={[styles.buttonText, { color }]}>{text}</Text>
      ) :
        children ?
          (children)
          :
          (null)
      }
    </BaseButton>
  );
};


const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    elevation: 3,
    minWidth: 110,
    paddingHorizontal: 18,
    paddingVertical: 11,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  buttonText: {
    color: '#6c6c6c',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
