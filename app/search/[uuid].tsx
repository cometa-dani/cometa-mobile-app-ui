import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { AppSearchInput } from '../../components/textInput/AppSearchInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { gray_200, gray_500 } from '../../constants/colors';


export default function SearchScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const uuid = useLocalSearchParams<{ uuid: string }>()['uuid'];

  const [toggleTabs, setToggleTabs] = useState(false);
  const [textInput, setTextInput] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>

      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: 'Search',
          headerTitleAlign: 'center'
        }}
      />
      <AppSearchInput
        value={textInput}
        setValue={setTextInput}
      />

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
          <Text style={[styles.tab, toggleTabs && { ...styles.tabActive, color: '#83C9DD' }]}>Places</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setToggleTabs(prev => !prev)}>
          <Text style={[styles.tab, !toggleTabs && { ...styles.tabActive, color: '#E44063' }]}>Users</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6
  },

  tab: {
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: gray_500
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: gray_200
  },
});
