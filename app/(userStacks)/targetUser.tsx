import { ModalTargetUserProfile } from '@/components/userProfile/modalTargetUser';
import { SystemBars } from 'react-native-edge-to-edge';


export default function TargetUserScreen() {
  return (
    <>
      <SystemBars style='dark' />
      <ModalTargetUserProfile />
    </>
  );
}
