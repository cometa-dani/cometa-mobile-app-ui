import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors } from '../../../../legacy_components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { SearchCityByName } from './searchCityByName';
import { SelectLanguages } from './selectLanguages';
import { If } from '../../../../legacy_components/utils/ifElse';
// import { useMutationLoggedInUserProfileById } from '../../../../queries/loggedInUser/userProfileHooks';


type UserProfileFields = 'homeTown' | 'currentLocation' | 'languages';


export default function EditUserProfileOptionsScreen(): JSX.Element {
  const { background } = useColors();
  const { field } = useLocalSearchParams<{ field: UserProfileFields }>();
  // const mutateLoggedInUserProfileById = useMutationLoggedInUserProfileById();

  const handleCitySelection = (selectedCity: string): void => {
    if (field === 'homeTown') {
      // mutateLoggedInUserProfileById.mutate({ payload: { homeTown: selectedCity }, userId: +userId });
    }
    if (field === 'currentLocation') {
      // mutateLoggedInUserProfileById.mutate({ payload: { currentLocation: selectedCity }, userId: +userId });
    }
    router.back();
  };

  const handleLanguageSelection = (selectedLanguages: string[]): void => {
    // if (userId)
    // mutateLoggedInUserProfileById
    //   .mutate({
    //     payload: {
    //       languages: selectedLanguages
    //     },
    //     userId: +userId
    //   });

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
