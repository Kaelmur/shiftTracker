import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="start" options={{ headerShown: false }} />
    </Stack>
  );
}
