import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { RectButton } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import { gray_900 } from '../../constants/colors';
import { FlashList } from '@shopify/flash-list';
import { FC, useState } from 'react';


const filterOptions = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4',
  'Option 5',
  'Option 6',
  'Option 7',
  'Option 8',
];


export default function SettingsScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const uuid = useLocalSearchParams<{ uuid: string }>()['uuid'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: 'Filter',
          headerTitleAlign: 'center'
        }}
      />
      <FlashList
        contentContainerStyle={{ paddingVertical: 20 }}
        stickyHeaderHiddenOnScroll={true}
        estimatedItemSize={70}
        data={filterOptions}
        renderItem={({ item: option }) => (
          <Item title={option} />
        )}
      />
    </SafeAreaView>
  );
}


interface ItemProps {
  title: string;
}

const Item: FC<ItemProps> = ({ title }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={styles.optionContainer}>
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={(val) => setIsChecked(val)}
        color={isChecked ? gray_900 : undefined}
      />

      <RectButton
        onPress={() => setIsChecked(prev => !prev)}
        style={styles.language}
      >
        <View style={styles.titleContainer}>
          <Text style={{ fontWeight: '700' }}>
            {title}
          </Text>
        </View>
      </RectButton>
    </View>
  );
};


const styles = StyleSheet.create({
  language: {
    height: 70,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },

  optionContainer: {
    justifyContent: 'center',
  },

  checkbox: {
    borderRadius: 5,
    zIndex: 10,
    position: 'absolute',
    left: 24,
  },

  titleContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});
