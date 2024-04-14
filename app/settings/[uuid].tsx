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
  'Option 9',
  'Option 10',
  'Option 11',
  'Option 12',
  'Option 13',
  'Option 14',
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
      <Text style={{ paddingHorizontal: 24, paddingVertical: 16, fontSize: 18, fontWeight: '700' }}>Category</Text>
      <FlashList
        contentContainerStyle={{ paddingBottom: 20 }}
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
    <RectButton
      onPress={() => setIsChecked(prev => !prev)}
      style={styles.option}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? gray_900 : undefined}
      />
      <View style={styles.titleContainer}>
        <Text style={{ fontWeight: '700' }}>
          {title}
        </Text>
      </View>
    </RectButton>
  );
};


const styles = StyleSheet.create({
  option: {
    paddingHorizontal: 24,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  checkbox: {
    borderRadius: 5,
  },

  titleContainer: {
    alignItems: 'center',
    gap: 8
  }
});
