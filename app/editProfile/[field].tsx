import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors } from '../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { SearchCityByName } from './searchCityByName';
import { SelectLanguages } from './selectLanguages';
import { If } from '../../components/utils/ifElse';
import { useMutationUserProfileById } from '../../queries/userHooks';


type UserProfileFields = 'homeTown' | 'currentLocation' | 'languages';


export default function EditProfileOptionsScreen(): JSX.Element {
  const { background } = useColors();
  const { field, userId } = useLocalSearchParams<{ field: UserProfileFields, userId: string }>();
  const mutateUserProfileById = useMutationUserProfileById();


  const handleCitySelection = (selectedCity: string): void => {
    if (field === 'homeTown' && userId) {
      mutateUserProfileById.mutate({ payload: { homeTown: selectedCity }, userId: +userId });
    }

    if (field === 'currentLocation' && userId) {
      mutateUserProfileById.mutate({ payload: { currentLocation: selectedCity }, userId: +userId });
    }
    router.back();
  };


  const handleLanguageSelection = (selectedLanguages: string[]): void => {
    if (userId)
      mutateUserProfileById
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
