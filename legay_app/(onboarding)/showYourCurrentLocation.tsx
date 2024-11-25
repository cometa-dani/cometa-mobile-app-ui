import { Image, StyleSheet } from 'react-native';
import { Text, View } from '../../legacy_components/Themed';
import { router } from 'expo-router';
import { AppWrapperOnBoarding, onBoardingStyles } from '../../legacy_components/onboarding/WrapperOnBoarding';
import { AppButton } from '../../legacy_components/buttons/buttons';
import { If } from '../../legacy_components/utils';
import { gray_300 } from '../../constants/colors';
import { BaseButton } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { badgesStyles } from '../../legacy_components/profile/badges';
import { useCometaStore } from '../../store/cometaStore';
import { useQueryGetUserByUid } from '../../queries/currentUser/userHooks';


export default function ShowCurrentLocationScreen(): JSX.Element {

  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const { data: userProfile } = useQueryGetUserByUid(uid);

  const pushEditProfileScreen = (field: string): void => {
    router.push(`/editUserProfile/${field}?userId=${userProfile?.id}`);
  };

  const handleNextSlide = (): void => {
    router.push('/(onboarding)/whereAreYouFrom');
  };

  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text size='lg' style={{ textAlign: 'center' }}>Show your location</Text>
      </View>
      {/* logo */}


      <View style={{ width: '100%', position: 'relative' }}>
        <View style={{ gap: 8 }}>
          <View style={{ gap: -4 }}>
            <Text style={{ color: gray_300 }}>Add where you live to meet people around you</Text>
          </View>

          <AppButton
            btnColor='white'
            onPress={() => pushEditProfileScreen('currentLocation')}
            style={{
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
                  btnColor='white'
                  text={userProfile?.currentLocation}
                  style={badgesStyles.badge}
                />
              )}
              elseRender={(
                <AppButton
                  btnColor='white'
                  text='Add'
                  style={{ ...badgesStyles.badge }}
                />
              )}
            />

            <BaseButton
              style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
              <FontAwesome name='chevron-right' size={18} />
            </BaseButton>
          </AppButton>
        </View>

        <View style={{ marginTop: 32 }}>
          <AppButton
            onPress={userProfile?.currentLocation ? handleNextSlide : undefined}
            btnColor='primary'
            text='NEXT'
          />
        </View>
      </View>

      <View>
        <AppButton
          onPress={handleNextSlide}
          btnColor='lightGray'
          text='skip this step'
        />
      </View>

    </AppWrapperOnBoarding>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
  }
});
