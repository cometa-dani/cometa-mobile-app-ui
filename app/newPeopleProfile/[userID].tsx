import { StyleSheet, SafeAreaView } from 'react-native';
import { Stack, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, useColors } from '../../components/Themed';
import * as Yup from 'yup';
import { profileStyles } from '../../components/profile/profileStyles';
import { ProfileAvatar } from '../../components/profile/profileAvatar';


const searchParamsSchemma = Yup.object({
  isFriend: Yup.boolean().required().transform((originalValue, originalObject) => {
    // Coerce string to number if it's a parsable number
    if (typeof originalValue === 'string') {
      return JSON.parse(originalValue); // boolean
    }
    // Otherwise, leave it as is
    return originalValue;
  }),
  userId: Yup.string().required(),
  // Yup.number().required().transform((originalValue, originalObject) => {
  //   // Coerce string to number if it's a parsable number
  //   if (typeof originalValue === 'string') {
  //     return parseInt(originalValue, 10);
  //   }
  //   // Otherwise, leave it as is
  //   return originalValue;
  // }),

  eventId: Yup.string().required()
});

export default function NewPeopleProfileScreen(): JSX.Element {
  const { background } = useColors();
  const urlParams = useLocalSearchParams();
  const safeParams = searchParamsSchemma.validateSync(urlParams);
  console.log(safeParams);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={'auto'} />

      <Stack.Screen
        options={{
          presentation: 'modal',
          animation: 'default',
          headerShown: true,
          headerTitle: '@new_people',
          headerTitleAlign: 'center'
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: background }}
      >
        <View style={profileStyles.container}>
          {/* <ProfileAvatar
            avatar={}
            description={description}
            name={name}
          /> */}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // container: {
  //   flex: 1,
  //   gap: 24,
  //   paddingHorizontal: 20,
  //   paddingVertical: 30
  // },
});
