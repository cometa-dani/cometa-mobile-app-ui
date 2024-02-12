import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../components/buttons/buttons';
import { If } from '../../components/utils';
import { gray_300 } from '../../constants/colors';
import { BaseButton } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { badgesStyles } from '../../components/profile/badges';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserProfileByUid } from '../../queries/userHooks';


export default function ShowCurrentLocationScreen(): JSX.Element {

  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);

  const navigateToEditProfilePushedScreen = (field: string): void => {
    router.push(`/editProfile/${field}`);
  };

  const handleNextSlide = (): void => {
    try {
      //  mutate the user object
      // actions.setSubmitting(false);
      router.push('/(onboarding)/whereAreYouFrom');
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

        <Text style={onBoardingStyles.title}>Show your location</Text>
      </View>
      {/* logo */}

      <View style={{ width: '100%', position: 'relative' }}>
        <View style={{ gap: 8 }}>
          <View style={{ gap: -4 }}>
            <Text style={{ color: gray_300 }}>Add where you live to meet people around you</Text>
          </View>

          <View style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            elevation: 3,
            borderRadius: 50,
            shadowColor: '#171717', // add shadow for iOS
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
              condition={userProfile?.currentLocation}
              render={(
                <AppButton
                  onPress={() => navigateToEditProfilePushedScreen('currentLocation')}
                  btnColor='white'
                  text={userProfile?.currentLocation}
                  style={badgesStyles.badge}
                />
              )}
              elseRender={(
                <AppButton
                  onPress={() => navigateToEditProfilePushedScreen('currentLocation')}
                  btnColor='white'
                  text='Add'
                  style={{ ...badgesStyles.badge }}
                />
              )}
            />

            <BaseButton
              onPress={() => navigateToEditProfilePushedScreen('currentLocation')}
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
