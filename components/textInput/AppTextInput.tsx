import { FC, ReactNode } from 'react';
import { TextInputProps, StyleSheet, View as TransparentView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../Themed';
import { FontAwesome, } from '@expo/vector-icons';
import { messages } from '../../constants/colors';


interface AppTextInputProps extends TextInputProps {
  iconName?: React.ComponentProps<typeof FontAwesome>['name']
}

export const AppTextInput: FC<AppTextInputProps> = ({ iconName, ...props }) => {
  const { background: backgroundColor, altText } = useColors();
  const { style, ...otherProps } = props;
  return (
    iconName ? (
      <View>
        <View style={textInputStyles.formFieldIconContainer}>
          <FontAwesome
            style={[textInputStyles.formFieldIcon, { color: altText }]}
            name={iconName}
            size={20}
          />
        </View>

        <TextInput {...otherProps} style={[textInputStyles.input, { backgroundColor, paddingLeft: 48 }, style]} />
      </View>
    )
      : (
        <TextInput {...otherProps} style={[textInputStyles.input, { backgroundColor }, style]} />
      )
  );
};


export const textInputStyles = StyleSheet.create({

  formFieldIcon: {
    fontWeight: '700',
    zIndex: 10
  },

  formFieldIconContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 18,
    position: 'absolute',
    zIndex: 10
  },

  input: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    elevation: 3, // add elevation to android
    borderRadius: 50,
    padding: 10,
    shadowColor: '#171717', // add shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  }
});


interface AppLabelProps {
  text: ReactNode,
  position?: 'top' | 'bottom'
}

export const AppLabelFeedbackMsg: FC<AppLabelProps> = ({ text, position = 'top' }) => {
  return (
    position === 'top' ? (
      <TransparentView style={formFieldStyles.formLabelTop}>
        <FontAwesome name='close' color={messages.error} size={20} />
        <Text style={{ color: messages.error, fontSize: 14 }}>{text}</Text>
      </TransparentView>
    ) : (
      <>
        <TransparentView style={formFieldStyles.cirle}>
          <FontAwesome name='exclamation' color={messages.error} size={16} />
        </TransparentView>

        <Text style={{ color: messages.error, ...formFieldStyles.textBottom }}>{text}</Text>
      </>
    )
  );
};


export const AppLabelMsgOk: FC<{ text: string }> = ({ text }) => (
  <TransparentView style={formFieldStyles.formLabelTop}>
    <FontAwesome name='check-circle-o' color={messages.ok} size={20} />
    <Text style={{ color: messages.ok, fontSize: 14 }}>{text} is available</Text>
  </TransparentView>
);

const formFieldStyles = StyleSheet.create({
  cirle: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: messages.error,
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    // paddingLeft: 20,
    position: 'absolute',
    right: 20,
  },

  formLabelTop: {
    zIndex: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingLeft: 20,
    position: 'absolute',
    top: -24
  },

  textBottom: {
    zIndex: 100,
    paddingLeft: 20,
    position: 'absolute',
    fontWeight: '500',
    fontSize: 12,
    bottom: -18,
  }
});
