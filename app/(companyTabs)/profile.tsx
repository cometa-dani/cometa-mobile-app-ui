import { GradientHeading } from '@/components/text/gradientText';
import { TextView } from '@/components/text/text';
import { UserNameSkeleton } from '@/components/userProfile/components/headerUser';
import { Condition } from '@/components/utils/ifElse';
import { useQueryGetCompanyProfile } from '@/queries/organization/organizationHooks';
import { Feather, Octicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function ProfileScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { data: companyProfile, isSuccess } = useQueryGetCompanyProfile();
  return (
    <>
      <SystemBars style='dark' />
      <Tabs.Screen
        options={{
          headerLeft() {
            return (
              <TouchableOpacity
                onPress={() => router.push('/(companyStacks)/settings')}
                style={{ marginLeft: theme.spacing.sp6 }}
              >
                <Octicons size={theme.spacing.sp10} name='gear' color={theme.colors.gray400} />
              </TouchableOpacity>
            );
          },
          headerRight() {
            return (
              <TouchableOpacity
                style={{ marginRight: theme.spacing.sp6 }}
              >
                <Feather size={theme.spacing.sp10} name='edit' color={theme.colors.gray400} />
              </TouchableOpacity >
            );
          },
          headerTitle: () => (
            <Condition
              if={!isSuccess}
              then={<UserNameSkeleton />}
              else={
                <GradientHeading styles={[{ fontSize: theme.text.size.s7 }]}>
                  {companyProfile?.name}
                </GradientHeading>
              }
            />
          ),
        }}
      />
      <View style={styles.container}>
        <TextView>Company profile</TextView>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    // backgroundColor: theme.colors.white100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
