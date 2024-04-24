import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, View, TextInput } from 'react-native';


interface AppSearchInputProps {
  placeholder?: string;
  onEnterPressed?: () => void;
  value: string;
  setValue: (text: string) => void;
}

export const AppSearchInput = forwardRef<TextInput, AppSearchInputProps>((props, ref) => {
  return (
    <View style={styles.innerView}>
      <View style={styles.relativeView}>
        <TextInput
          ref={ref}
          style={styles.input}
          value={props.value}
          onChangeText={props.setValue}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              props.onEnterPressed?.();
            }
          }}
          placeholder={props.placeholder ?? 'Search...'}
        />
        <Pressable style={styles.pressable}>
          {({ pressed }) => (
            <Ionicons
              name="search-circle"
              size={34}
              style={{ opacity: pressed ? 0.5 : 1 }}
              color="#83C9DD"
            />
          )}
        </Pressable>
      </View>
    </View>
  );
});

AppSearchInput.displayName = 'AppSearchInput';


const styles = StyleSheet.create({
  innerView: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  relativeView: {
    position: 'relative',
    justifyContent: 'center'
  },

  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingLeft: 56
  },

  pressable: {
    position: 'absolute',
    zIndex: 30,
    left: 10,
    borderRadius: 50,
    padding: 4.4
  },
});
