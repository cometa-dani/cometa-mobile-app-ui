import { GradientHeading } from '@/components/text/gradientText';
// import { Condition } from '@/components/utils/ifElse';
import { Feather, Octicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function ProfileScreen() {
  const { styles, theme } = useStyles(stylesheet);
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
                // onPress={() => router.push('/(userStacks)/editUserProfile')}
                style={{ marginRight: theme.spacing.sp6 }}
              >
                <Feather size={theme.spacing.sp10} name='edit' color={theme.colors.gray400} />
              </TouchableOpacity >
            );
          },
          headerTitle: () => (
            <GradientHeading styles={[{ fontSize: theme.text.size.s7 }]}>
              {/* {userProfile?.username} */}
              Company Name
            </GradientHeading>
            // <Condition
            //   if={!isUserProfileSuccess}
            //   then={<UserNameSkeleton />}
            //   else={
            //   }
            // />
          ),
        }}
      />
      <View style={styles.container}>
        <Text>Company profile</Text>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.white100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
