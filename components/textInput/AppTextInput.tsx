import { FC } from 'react';
import { TextInputProps, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../Themed';
import { FontAwesome, } from '@expo/vector-icons';


interface AppTextInputProps extends TextInputProps {
  iconName?: React.ComponentProps<typeof FontAwesome>['name']
}

export const AppTextInput: FC<AppTextInputProps> = ({ iconName, ...props }) => {
  const { background: backgroundColor, altText } = useColors();
  const { style, ...otherProps } = props;
  return (
    iconName ? (
      <View>
        <View style={styles.formFieldIconContainer}>
          <FontAwesome
            style={[styles.formFieldIcon, { color: altText }]}
            name={iconName}
            size={21}
          />
        </View>

        <TextInput {...otherProps} style={[styles.input, { backgroundColor, paddingLeft: 48 }, style]} />
      </View>
    )
      : (
        <TextInput {...otherProps} style={[styles.input, { backgroundColor }, style]} />
      )
  );
};


const styles = StyleSheet.create({

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
    borderRadius: 50,
    elevation: 3,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  }
});


export const AppInputFeedbackMsg: FC<{ text: string }> = ({ text }) => (
  <Text style={formFieldStyles.formLabel}>{text}</Text>
);

const formFieldStyles = StyleSheet.create({
  formLabel: {
    color: '#bc544c',
    paddingLeft: 20,
    position: 'absolute',
    top: -24
  },
});
