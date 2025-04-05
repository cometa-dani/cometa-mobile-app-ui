import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors } from '../../../legacy_components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { SearchCityByName } from './searchCityByName';
import { SelectLanguages } from './selectLanguages';
import { If } from '../../../legacy_components/utils/ifElse';
import { useMutationUpdateUserById } from '../../../queries/currentUser/userHooks';


type UserProfileFields = 'homeTown' | 'currentLocation' | 'languages';


export default function EditUserProfileOptionsScreen(): JSX.Element {
  const { background } = useColors();
  const { field, userId } = useLocalSearchParams<{ field: UserProfileFields, userId: string }>();
  const mutateLoggedInUserProfileById = useMutationUpdateUserById();


  const handleCitySelection = (selectedCity: string): void => {
    if (field === 'homeTown' && userId) {
      mutateLoggedInUserProfileById.mutate({ payload: { homeTown: selectedCity }, userId: +userId });
    }

    if (field === 'currentLocation' && userId) {
      mutateLoggedInUserProfileById.mutate({ payload: { currentLocation: selectedCity }, userId: +userId });
    }
    router.back();
  };


  const handleLanguageSelection = (selectedLanguages: string[]): void => {
    if (userId)
      mutateLoggedInUserProfileById
        .mutate({
          payload: {
            languages: selectedLanguages
          },
          userId: +userId
        });

    router.back();
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <StatusBar style={'auto'} />

      <If condition={field !== 'languages'}
        render={(
          <SearchCityByName
            onSaveCity={handleCitySelection}
            userProfileField={field}
          />
        )}
      />

      <If condition={field === 'languages'}
        render={(
          <SelectLanguages onSelectLanguages={handleLanguageSelection} />
        )}
      />
    </SafeAreaView>
  );
}
