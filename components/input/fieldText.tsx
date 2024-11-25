import { IUserClientState } from '@/models/User';
import { FC, useState } from 'react';
import { HStack, VStack } from '../utils/stacks';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { KeyboardTypeOptions, Text, View } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';


interface IFieldTextProps {
  label: string,
  name: keyof IUserClientState,
  placeholder?: string,
  keyboardType?: KeyboardTypeOptions,
  secureTextEntry?: boolean,
  iconName: React.ComponentProps<typeof FontAwesome>['name'],
  defaultErrMessage?: string
}

export const FieldText: FC<IFieldTextProps> = ({
  label,
  name,
  secureTextEntry = false,
  keyboardType = 'default',
  placeholder,
  iconName,
  defaultErrMessage
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { styles: inputStyles, theme } = useStyles(inputSheet);
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const errorMessage = error?.message;
        const iconColor = (
          errorMessage ?
            theme.colors.red80 :
            isFocused ?
              theme.colors.blue100 :
              theme.colors.gray300  // default color
        );
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
                  color={iconColor}
                />
              </View>
              <BottomSheetTextInput
                secureTextEntry={secureTextEntry}
                style={inputStyles.field(isFocused, Boolean(errorMessage))}
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChange}
                onBlur={() => { onBlur(); setIsFocused(false); }}
                onFocus={() => setIsFocused(true)}
              />
            </VStack>

            <HStack
              $y='center'
              gap={theme.spacing.sp1}
              styles={{
                paddingLeft: theme.spacing.sp8
              }}
            >
              <AntDesign
                name={errorMessage ? 'exclamationcircleo' : 'checkcircleo'}
                size={theme.icons.xs}
                color={iconColor}
              />
              <Text style={inputStyles.fieldTextMessage(Boolean(errorMessage), isFocused)}>
                {errorMessage || defaultErrMessage}
              </Text>
            </HStack>
          </VStack>
        );
      }}
    />
  );
};


const inputSheet = createStyleSheet((theme) => ({
  fieldTextMessage: (isError: boolean, isFocused?: boolean) => ({
    color: isError ? theme.colors.red100 : isFocused ? theme.colors.blue100 : theme.colors.gray300,
    opacity: 0.8,
    fontFamily: theme.text.fontRegular,
    fontSize: theme.text.size.s2,
    paddingVertical: theme.spacing.sp1,
    // textTransform: 'capitalize'
  }),
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
    fontSize: theme.text.size.s1,
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
  field: (isFocused: boolean, isError?: boolean) => ({
    backgroundColor: theme.colors.white80,
    paddingHorizontal: theme.spacing.sp6,
    paddingLeft: 60,
    paddingBottom: theme.spacing.sp4,
    paddingTop: theme.spacing.sp8,
    borderRadius: theme.radius.sm,
    fontFamily: theme.text.fontMedium,
    borderWidth: 1.6,
    borderColor: isError ? theme.colors.red70 : isFocused ? theme.colors.blue100 : 'transparent',
    shadowColor: isError ? theme.colors.red70 : isFocused ? theme.colors.blue100 : undefined,
    shadowOpacity: isFocused || isError ? 0.1 : 0,
    shadowOffset: isFocused || isError ? { width: 0, height: 3 } : undefined,
    shadowRadius: isFocused || isError ? 2 : 0,
    elevation: isFocused || isError ? 1 : 0,
    animationTimingFunction: 'ease-in-out',
  })
}));
