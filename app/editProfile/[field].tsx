/* eslint-disable no-unused-vars */
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors } from '../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { SearchCityByName } from './searchCityByName';
import { SelectLanguages } from './selectLanguages';


type UserProfileFields = 'homeTown' | 'currentLocation' | 'languages';

export default function EditProfileOptionsScreen(): JSX.Element {
  const { background } = useColors();
  const userProfileField = useLocalSearchParams<{ field: UserProfileFields }>()['field'];

  const handleCitySelection = (selectedCity: string): void => {
    // mutation logic
    // if (userProfileField === 'homeTown') {
    //   console.log('homeTown');
    // }
    // else {
    //   console.log('currentLocation');
    // }
    // console.log('selectedCity', selectedCity);
    router.back();
  };

  const handleLanguageSelection = (selectedLanguages: string[]): void => {
    console.log('selectedLanguages', selectedLanguages);
    router.back();
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <StatusBar style={'auto'} />

      {userProfileField !== 'languages' && (
        <SearchCityByName
          onSaveCity={handleCitySelection}
          userProfileField={userProfileField}
        />
      )}

      {userProfileField === 'languages' && (
        <SelectLanguages onSelectLanguages={handleLanguageSelection} />
      )}

    </SafeAreaView>
  );
}
