import { IUserOnboarding } from '@/models/User';
import { FC, useState } from 'react';
import { HStack, VStack } from '../utils/stacks';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { KeyboardTypeOptions, Text, View } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { nodeEnv } from '@/constants/vars';


interface IFieldTextProps {
  testId?: string,
  label: string,
  name: keyof IUserOnboarding,
  placeholder?: string,
  keyboardType?: KeyboardTypeOptions,
  secureTextEntry?: boolean,
  iconName: React.ComponentProps<typeof FontAwesome>['name'],
  defaultErrMessage?: string,
  multiline?: boolean,
  editable?: boolean,
  isDateTimePicker?: boolean
}

export const FieldText: FC<IFieldTextProps> = ({
  label,
  name,
  secureTextEntry = false,
  keyboardType = 'default',
  placeholder,
  iconName,
  defaultErrMessage,
  multiline = false,
  editable = true,
  isDateTimePicker = false,
  testId
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { styles, theme } = useStyles(inputSheet);
  const { control, setValue, setError } = useFormContext();
  const [date, setDate] = useState<Date | undefined>();
  const [openDatePicker, setOpenDatePicker] = useState(false);
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
            <DatePicker
              modal={true}
              mode='date'
              open={openDatePicker}
              date={date ? date : new Date()}
              onConfirm={(date) => {
                setDate(date);
                setValue(name, new Intl.DateTimeFormat('en-US').format(date));
                setError(name, { message: undefined });
                setOpenDatePicker(false);
              }}
              onCancel={() => {
                setOpenDatePicker(false);
              }}
            />
            <VStack styles={styles.fiedContainer}>
              <View style={styles.fieldLabel}>
                <Text style={styles.fieldTextLabel}>
                  {label}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <FontAwesome
                  name={iconName}
                  size={theme.icons.lg}
                  color={iconColor}
                />
              </View>
              <BottomSheetTextInput
                testID={testId}
                onPress={() => isDateTimePicker && setOpenDatePicker(true)}
                editable={editable}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                secureTextEntry={nodeEnv === 'development' ? false : secureTextEntry}
                style={styles.field(isFocused, Boolean(errorMessage))}
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoCapitalize='none'
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
              <Text style={styles.fieldTextMessage(Boolean(errorMessage), isFocused)}>
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
    borderRightColor: theme.colors.gray200,
    borderRightWidth: 1,
    paddingVertical: 3,
  },
  field: (isFocused: boolean, isError?: boolean) => ({
    backgroundColor: theme.colors.white80,
    paddingHorizontal: theme.spacing.sp6,
    paddingLeft: 60,
    paddingBottom: theme.spacing.sp4,
    paddingTop: theme.spacing.sp10,
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
  }),
  calendar: {
    backgroundColor: theme.colors.white100,
    paddingVertical: theme.spacing.sp8,
    paddingHorizontal: theme.spacing.sp6,
    borderRadius: theme.radius.sm
  }
}));
