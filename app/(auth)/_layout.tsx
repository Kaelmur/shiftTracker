import { Stack } from "expo-router";

export default function Layout() {
  // const { isLoaded, user } = useUser();
  // const [role, setRole] = useState<string | null>(null);

  // if (isSignedIn && role === "admin") {
  //   return <Redirect href={"/(root)/(tabs)/home"} />;
  // }

  // if (isSignedIn && role === "worker") {
  //   return <Redirect href="/(root)/(worker)/start" />;
  // }

  return (
    <Stack>
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
}
