import { IUserClientState } from '@/models/User';
import { useFormikContext } from 'formik';
import { FC, useState } from 'react';
import { VStack } from '../utils/stacks';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { KeyboardTypeOptions, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';


interface IFieldTextProps {
  label: string,
  name: keyof IUserClientState,
  placeholder?: string,
  keyboardType?: KeyboardTypeOptions,
  secureTextEntry?: boolean,
  iconName: React.ComponentProps<typeof FontAwesome>['name']
}

export const FieldText: FC<IFieldTextProps> = ({ label, name, secureTextEntry, keyboardType, placeholder, iconName }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { styles: inputStyles, theme } = useStyles(inputSheet);
  const { getFieldProps, errors, touched, handleChange, } = useFormikContext<IUserClientState>();
  const { value } = getFieldProps(name);
  return (
    <VStack>
      <VStack styles={inputStyles.fiedContainer}>
        <View style={inputStyles.fieldLabel}>
          <Text style={inputStyles.fieldTextLabel}>
            {label}
          </Text>
        </View>
        <View style={inputStyles.iconContainer}>
          <FontAwesome
            name={iconName}
            size={theme.icons.lg}
            color={isFocused ? theme.colors.blue100 : theme.colors.gray300}
          />
        </View>
        <BottomSheetTextInput
          secureTextEntry={secureTextEntry}
          style={inputStyles.field(isFocused)}
          placeholder={placeholder}
          keyboardType={keyboardType ?? 'default'}
          value={value}
          onChangeText={handleChange(name)}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
      </VStack>

      <Text style={inputStyles.fieldTextError}>{errors.name ?? 'Name is required in this field'}</Text>
    </VStack>
  );
};


const inputSheet = createStyleSheet((theme) => ({
  fieldTextError: {
    color: theme.colors.red100,
    fontFamily: theme.text.fontRegular,
    fontSize: theme.text.size.sm,
    opacity: 0.8,
    paddingVertical: theme.spacing.sp1
  },
  fiedContainer: {
    position: 'relative',
    justifyContent: 'center'
  },
  fieldLabel: {
    position: 'absolute',
    zIndex: 1,
    left: 60,
    top: 6
  },
  fieldTextLabel: {
    fontSize: theme.text.size.xs,
    color: theme.colors.gray300,
    fontFamily: theme.text.fontMedium
  },
  iconContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    left: 8,
    width: 44,
    // backgroundColor: theme.colors.red70,
    borderRightColor: theme.colors.gray200,
    borderRightWidth: 1,
    paddingVertical: 3,
  },
  field: (isFocused: boolean) => ({
    backgroundColor: theme.colors.white80,
    paddingHorizontal: theme.spacing.sp6,
    paddingLeft: 60,
    paddingBottom: theme.spacing.sp4,
    paddingTop: theme.spacing.sp8,
    borderRadius: theme.radius.sm,
    fontFamily: theme.text.fontMedium,
    borderWidth: 1.6,
    borderColor: isFocused ? theme.colors.blue100 : 'transparent',
    shadowColor: isFocused ? theme.colors.blue100 : undefined,
    shadowOpacity: isFocused ? 0.18 : 0,
    shadowOffset: isFocused ? { width: 0, height: 3 } : undefined,
    shadowRadius: isFocused ? 2 : 0,
    elevation: isFocused ? 1 : 0,
    animationTimingFunction: 'ease-in-out',
  })
}));
