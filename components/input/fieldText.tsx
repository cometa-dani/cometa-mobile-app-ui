import { IUserOnboarding } from '@/models/User';
import { FC, useState } from 'react';
import { HStack, VStack } from '../utils/stacks';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { KeyboardTypeOptions, Text, View, TextInput } from 'react-native';
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
  isDateTimePicker?: boolean,
  isInsideBottomSheet?: boolean
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
  testId,
  isInsideBottomSheet = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { styles, theme } = useStyles(inputSheet);
  const { control, setValue, setError } = useFormContext();
  const [date, setDate] = useState<Date | undefined>();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const DynamicTextInput = isInsideBottomSheet ? BottomSheetTextInput : TextInput;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => {
        const errorMessage = error?.message;
        const iconColor = (
          errorMessage ?
            theme.colors.red80 :
            isFocused ?
              theme.colors.blue100 :
              theme.colors.gray300  // default color
        );
        const inputStyle = (
          errorMessage ?
            theme.colors.red80 :
            isFocused ?
              theme.colors.blue100 :
              'transparent'
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
            <View style={[styles.fieldContainer, { borderColor: inputStyle }]}>
              <View style={styles.iconContainer}>
                <FontAwesome
                  name={iconName}
                  size={theme.icons.lg}
                  color={iconColor}
                />
              </View>

              <View style={styles.divider} />

              <VStack styles={{ flex: 1 }}>
                <View style={styles.fieldLabel}>
                  <Text style={styles.fieldTextLabel}>
                    {label}
                  </Text>
                </View>
                <DynamicTextInput
                  testID={testId}
                  onPress={() => isDateTimePicker && setOpenDatePicker(true)}
                  editable={editable}
                  multiline={multiline}
                  numberOfLines={multiline ? 4 : 1}
                  secureTextEntry={nodeEnv === 'development' ? false : secureTextEntry}
                  style={styles.field}
                  placeholder={placeholder}
                  keyboardType={keyboardType}
                  autoCapitalize='none'
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => { setIsFocused(false); }}
                  onFocus={() => setIsFocused(true)}
                />
              </VStack>
            </View>

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
  divider: {
    width: 1.5,
    height: '70%',
    alignSelf: 'center',
    backgroundColor: theme.colors.gray200,
    opacity: 0.5
  },
  fieldTextMessage: (isError: boolean, isFocused?: boolean) => ({
    color: isError ? theme.colors.red100 : isFocused ? theme.colors.blue100 : theme.colors.gray300,
    opacity: 0.8,
    fontFamily: theme.text.fontRegular,
    fontSize: theme.text.size.s2,
    paddingVertical: theme.spacing.sp1,
  }),
  fieldContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white80,
    borderRadius: theme.radius.sm,
    borderWidth: 1.6,
    animationTimingFunction: 'ease-in-out',
  },
  fieldLabel: {
    padding: 0,
    paddingLeft: theme.spacing.sp2,
    paddingTop: theme.spacing.sp1,
    margin: 0
  },
  fieldTextLabel: {
    fontSize: theme.text.size.s1,
    padding: 0,
    margin: 0,
    color: theme.colors.gray300,
    fontFamily: theme.text.fontMedium
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
  },
  field: {
    fontFamily: theme.text.fontMedium,
    // fontSize: Platform.select({ ios: theme.text.size.s4, android: theme.text.size.s5 }),
    color: theme.colors.gray900,
    padding: theme.spacing.sp2,
    flex: 1
  },
  calendar: {
    backgroundColor: theme.colors.white100,
    paddingVertical: theme.spacing.sp8,
    paddingHorizontal: theme.spacing.sp6,
    borderRadius: theme.radius.sm
  }
}));
