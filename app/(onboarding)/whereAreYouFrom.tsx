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


export default function WhereAreYouFromScreen(): JSX.Element {

  const uid = useCometaStore(state => state.uid); // this can be abstracted
  const { data: userProfile } = useQueryGetUserProfileByUid(uid);

  const pushEditProfileScreen = (field: string): void => {
    router.push(`/editProfile/${field}?userId=${userProfile?.id}`);
  };

  const handleNextSlide = (): void => {
    router.push('/(onboarding)/howManyLanguagesDoYouSpeak');
  };

  return (
    <AppWrapperOnBoarding>
      {/* logo */}
      <View style={styles.figure}>
        <Image style={onBoardingStyles.logo} source={require('../../assets/images/cometa-logo.png')} />

        <Text style={onBoardingStyles.title}>Where are you from?</Text>
      </View>
      {/* logo */}

      <View style={{ width: '100%', position: 'relative' }}>
        <View style={{ gap: 8 }}>
          <View style={{ gap: -4 }}>
            <Text style={{ color: gray_300 }}>Native country or place of origin</Text>
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
              condition={userProfile?.homeTown}
              render={(
                <AppButton
                  onPress={() => pushEditProfileScreen('homeTown')}
                  btnColor='white'
                  text={userProfile?.homeTown}
                  style={badgesStyles.badge}
                />
              )}
              elseRender={(
                <AppButton
                  onPress={() => pushEditProfileScreen('homeTown')}
                  btnColor='white'
                  text='Add'
                  style={{ ...badgesStyles.badge }}
                />
              )}
            />

            <BaseButton
              onPress={() => pushEditProfileScreen('homeTown')}
              style={{ borderRadius: 50, padding: 4, position: 'absolute', right: 20 }}>
              <FontAwesome name='chevron-right' size={18} />
            </BaseButton>
          </View>
        </View>

        <View style={{ marginTop: 32 }}>
          <AppButton
            onPress={userProfile?.homeTown ? handleNextSlide : undefined}
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
