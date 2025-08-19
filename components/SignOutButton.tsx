import { icons } from "@/constants";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import { Alert, Image, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      "Выход",
      "Вы уверены, что хотите выйти?",
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Выйти",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/(auth)/sign-in");
            } catch (err) {
              console.error(JSON.stringify(err, null, 2));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Image className="size-7" source={icons.out}></Image>
    </TouchableOpacity>
  );
};
