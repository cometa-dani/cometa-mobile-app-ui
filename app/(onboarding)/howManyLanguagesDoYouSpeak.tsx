import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../components/buttons/buttons';
import { ForEach, If } from '../../components/utils';
import { BaseButton } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { badgesStyles } from '../../components/profile/badges';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserProfileByUid } from '../../queries/userHooks';


export default function HowManyLanguagesScreen(): JSX.Element {

  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const setIsAuthenticated = useCometaStore(state => state.setIsAuthenticated);
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);

  const navigateToEditProfilePushedScreen = (field: string): void => {
    router.push(`/editProfile/${field}?userId=${uid}`);
  };

  const handleNextSlide = (): void => {
    try {
      setIsAuthenticated(true);
      router.push('/(app)/');
    }
    catch (error) {
      // console.log(error);
    }
  };

  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={{ ...onBoardingStyles.title, textAlign: 'center' }}>
          How many languages
          do you speak?
        </Text>
      </View>
      {/* logo */}

      <View style={{ width: '100%', position: 'relative' }}>
        <View style={{ gap: 8 }}>

          <View style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            elevation: 3,
            borderRadius: 50,
            shadowColor: '#171717',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 3.84,
            paddingVertical: 12,
            paddingHorizontal: 20,
          }}>
            <If
              condition={userProfile?.languages?.length}
              elseRender={(
                <AppButton
                  onPress={() => navigateToEditProfilePushedScreen('languages')}
                  btnColor='white'
                  text='Add'
                  style={badgesStyles.badge}
                />
              )}
              render={(
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '80%' }}>
                  <ForEach items={userProfile?.languages ?? []}>
                    {(language, index) => (
                      <AppButton
                        key={index}
                        btnColor='white'
                        text={language}
                        onPress={() => navigateToEditProfilePushedScreen('languages')}
                        style={badgesStyles.badge}
                      />
                    )}
                  </ForEach>
                </View>
              )}
            />

            <BaseButton
              onPress={() => navigateToEditProfilePushedScreen('languages')}
              style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
              <FontAwesome name='chevron-right' size={18} />
            </BaseButton>
          </View>
        </View>

        <View style={{ marginTop: 32 }}>
          <AppButton
            onPress={() => handleNextSlide()}
            btnColor='primary'
            text='NEXT'
          />
        </View>
      </View>
    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
  }
});
