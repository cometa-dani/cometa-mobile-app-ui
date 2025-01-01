// import { ModalTargetUserProfile } from '@/components/userProfile/modalTargetUser';
// import { Stack } from 'expo-router';
import { MatcheEventsModal } from '@/components/eventsList/matchedEventsModal';
import { Stack } from 'expo-router';
import { SystemBars } from 'react-native-edge-to-edge';


export default function MatchedEventsScreen() {
  return (
    <>
      <SystemBars style='dark' />
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_bottom'
        }}
      />
      <MatcheEventsModal />
      {/* <ModalTargetUserProfile /> */}
    </>
  );
}
