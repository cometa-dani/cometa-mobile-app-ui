import { SelectLanguages } from '@/components/modal/selectLanguages/selectLanguages';
import { Stack } from 'expo-router';


export default function SelectLanguagesScreen() {
  return (
    <>
      <Stack.Screen />
      <SelectLanguages
        onSelectLanguages={() => { }}
      />
    </>
  );
}
