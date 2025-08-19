import { DecodedToken } from "@/types/type";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("jwt_token");

      if (!token) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        router.replace("/(auth)/sign-in");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          await SecureStore.deleteItemAsync("jwt_token");
          setIsAuthenticated(false);
          router.replace("/(auth)/sign-in");
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
        await SecureStore.deleteItemAsync("jwt_token");
        router.replace("/(auth)/sign-in");
      }

      setCheckingAuth(false);
    };

    checkToken();
  }, []);

  if (checkingAuth) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Stack>
      <Stack.Screen name="(worker)" options={{ headerShown: false }} />
    </Stack>
  );
}
