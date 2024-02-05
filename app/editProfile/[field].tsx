import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors } from '../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { SearchCityByName } from './searchCityByName';
import { SelectLanguages } from './selectLanguages';
import { If } from '../../components/utils/ifElse';
import { useMutationUserProfileById, useQueryGetUserProfileByUid } from '../../queries/userHooks';
import { useCometaStore } from '../../store/cometaStore';


type UserProfileFields = 'homeTown' | 'currentLocation' | 'languages';


export default function EditProfileOptionsScreen(): JSX.Element {
  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);

  const { background } = useColors();
  const searchParams = useLocalSearchParams<{ field: UserProfileFields }>()['field'];
  const mutateUserProfileById = useMutationUserProfileById();


  const handleCitySelection = (selectedCity: string): void => {
    if (searchParams === 'homeTown' && userProfile?.id) {
      mutateUserProfileById.mutate({ payload: { homeTown: selectedCity }, userId: userProfile?.id });
    }

    if (searchParams === 'currentLocation' && userProfile?.id) {
      mutateUserProfileById.mutate({ payload: { currentLocation: selectedCity }, userId: userProfile?.id });
    }
    router.back();
  };


  const handleLanguageSelection = (selectedLanguages: string[]): void => {
    if (userProfile?.id)
      mutateUserProfileById
        .mutate({
          payload: {
            languages: selectedLanguages
          },
          userId: userProfile?.id
        });

    router.back();
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <StatusBar style={'auto'} />

      <If condition={searchParams !== 'languages'}
        render={(
          <SearchCityByName
            onSaveCity={handleCitySelection}
            userProfileField={searchParams}
          />
        )}
      />

      <If condition={searchParams === 'languages'}
        render={(
          <SelectLanguages onSelectLanguages={handleLanguageSelection} />
        )}
      />
    </SafeAreaView>
  );
}
