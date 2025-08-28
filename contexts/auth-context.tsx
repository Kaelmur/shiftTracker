import { AuthContextType, DecodedToken } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  name: null,
  isLoading: true,
  logout: async () => {},
  login: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const stored = await SecureStore.getItemAsync("jwt_token");
        if (!stored) return;

        const decoded: DecodedToken = jwtDecode(stored);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          setToken(stored);
          setUserId(decoded.userId);
          setName(decoded.name ?? null);
        } else {
          await SecureStore.deleteItemAsync("jwt_token");
        }
      } catch {
        await SecureStore.deleteItemAsync("jwt_token");
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    await SecureStore.setItemAsync("jwt_token", newToken);

    await AsyncStorage.setItem("jwt_token", newToken);
    const decoded: DecodedToken = jwtDecode(newToken);
    setToken(newToken);
    setUserId(decoded.userId);
    setName(decoded.name ?? null);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    setToken(null);
    setName(null);
    setUserId(null);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{ token, userId, name, isLoading, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
