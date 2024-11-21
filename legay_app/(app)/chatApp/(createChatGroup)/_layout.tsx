import { Stack, } from 'expo-router';


export function ChatCreatGroupLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right'
      }}
    />
  );
}
