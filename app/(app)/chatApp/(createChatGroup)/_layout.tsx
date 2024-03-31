import { Stack, } from 'expo-router';


export default function ChatCreatGroupLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right'
      }}
    />
  );
}
