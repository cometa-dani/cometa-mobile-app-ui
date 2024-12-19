import { Ionicons } from '@expo/vector-icons';
import { FC, useState } from 'react';
import { Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useStyles } from 'react-native-unistyles';


interface IProps {
  options: { label: string, value: string }[];
  onValueChange?: (value: string) => void;
  initialValue: string;
}
export const SelectField: FC<IProps> = ({ initialValue, options, onValueChange }) => {
  const { theme } = useStyles();
  const [value, setValue] = useState(initialValue);
  return (
    <RNPickerSelect
      useNativeAndroidPickerStyle={false}
      style={{
        inputIOSContainer: {
          pointerEvents: 'none',
        },
        inputIOS: {
          fontFamily: theme.text.fontRegular,
          color: theme.colors.gray900,
        },
        inputAndroid: {
          fontFamily: theme.text.fontRegular,
          color: theme.colors.gray900
        },
        placeholder: {
          fontFamily: theme.text.fontRegular,
        }
      }}
      dropdownItemStyle={{
        paddingHorizontal: theme.spacing.sp10,
      }}
      pickerProps={Platform.select({
        ios: {
          style: {
            backgroundColor: theme.colors.slate50,
            fontFamily: theme.text.fontRegular,
          },
          itemStyle: {
            fontFamily: theme.text.fontRegular,
            fontSize: theme.text.size.s4,
            color: theme.colors.gray900
          },
        },
        android: {
          itemStyle: {
            fontFamily: theme.text.fontRegular,
            fontSize: theme.text.size.s4,
            color: theme.colors.gray900
          },
        }
      })}
      touchableWrapperProps={{
        style: {
          backgroundColor: theme.colors.slate75,
          paddingVertical: theme.spacing.sp6,
          paddingRight: theme.spacing.sp8,
          paddingLeft: theme.spacing.sp12,
          borderRadius: theme.radius.sm,
        }
      }}
      Icon={() =>
        <Ionicons
          name="chevron-down"
          size={theme.spacing.sp10}
          color={theme.colors.gray400}
        />}
      placeholder={{}}
      value={value}
      onValueChange={(value) => {
        setValue(value);
        onValueChange && onValueChange(value);
      }}
      items={options}
    />
  );
};
