import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { forwardRef, useState } from 'react';
import { Platform, TextInput, TouchableOpacity } from 'react-native';
import { HStack } from '../utils/stacks';
import { FontAwesome } from '@expo/vector-icons';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


interface IProps {
  /**
   *
   * @description triggers when user types with a delay
   * of 1.6 seconds or presses the search button
   */
  onSearch: (value: string) => void,
  placeholder?: string
}
export const SearchField = forwardRef<TextInput, IProps>(({ onSearch, placeholder }, ref) => {
  const { styles: cityStyles, theme } = useStyles(styleSheet);
  const [inputValue, setInputValue] = useState('');
  const inputRef = ref as React.MutableRefObject<TextInput>;

  useDebouncedCallback(() => {
    if (!inputValue) return;
    onSearch(inputValue);
  }, [inputValue]);

  return (
    <HStack $x='space-between' $y='center' styles={cityStyles.textInputContainer}>
      <TextInput
        autoComplete='country'
        ref={inputRef}
        style={cityStyles.textInput}
        placeholder={placeholder}
        value={inputValue}
        onChangeText={setInputValue}
      />
      <TouchableOpacity
        onPress={() => {
          inputRef.current.blur();
          onSearch(inputValue);
        }}>
        <FontAwesome color={theme.colors.gray900} name='search' size={theme.icons.md} />
      </TouchableOpacity>
    </HStack>
  );
});

SearchField.displayName = 'SearchField';


const styleSheet = createStyleSheet((theme) => ({
  textInputContainer: {
    flex: 1,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.white80,
    paddingVertical: theme.spacing.sp2,
    paddingHorizontal: theme.spacing.sp4,
    gap: theme.spacing.sp2
  },
  textInput: {
    textAlign: 'left',
    fontSize: Platform.select({ ios: theme.text.size.s4, android: theme.text.size.s5 }),
    fontFamily: 'Poppins',
    color: theme.colors.gray900,
    flex: 1
  }
}));
