/* eslint-disable no-unused-vars */
import { FC, ReactNode } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { useColors, Text } from '../Themed';
import { buttonColors } from '../../constants/colors';
import { BaseButton, BaseButtonProps } from 'react-native-gesture-handler';


interface Props extends BaseButtonProps {
  text: string
  textStyles?: TextStyle
}
// TODO: remove this button is unnecesary and replace it with AppButton
export const LightButton: FC<Props> = ({ text, textStyles = {}, ...props }) => {
  const { background } = useColors();
  const { style, ...otherProps } = props;
  const buttonStyles = [appButtonstyles.button, { backgroundColor: background }, style];
  const allTextStyles = [appButtonstyles.buttonText, textStyles];

  return (
    <BaseButton {...otherProps} style={buttonStyles}>
      <Text style={allTextStyles}>{text}</Text>
    </BaseButton>
  );
};


interface AppButtonProps extends BaseButtonProps {
  text?: string,
  children?: ReactNode
  btnColor: 'black' | 'gray' | 'blue' | 'white' | 'primary' | 'lightGray' | 'transparent',
}

export const AppButton: FC<AppButtonProps> = ({ children, text, btnColor, ...props }) => {
  const { background, color } = buttonColors[btnColor];
  const { style, ...otherProps } = props;
  const buttonStyles = [{ backgroundColor: background }, appButtonstyles.button, style];
  const textStyles = [appButtonstyles.buttonText, { color }];

  return (
    <BaseButton  {...otherProps} style={buttonStyles}>
      {text ? (
        <Text style={textStyles}>{text}</Text>
      ) :
        children ?
          (children)
          :
          (null)
      }
    </BaseButton>
  );
};


export const appButtonstyles = StyleSheet.create({
  button: {
    borderRadius: 16,
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
    textAlign: 'center',
  },
});
