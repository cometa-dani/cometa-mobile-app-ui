import { Stack, } from 'expo-router';


export default function ChatAppLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerShown: false
      }}
    />
  );
}
