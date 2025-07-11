import { icons } from "@/constants";
import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Image, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/(auth)/sign-in"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Image className="size-7" source={icons.out}></Image>
    </TouchableOpacity>
  );
};
