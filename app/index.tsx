import { useUser } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const Home = () => {
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const router = useRouter();

  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const getRole = async () => {
      if (isSignedIn && email) {
        try {
          const res = await fetch("/(api)/role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
          });

          const data = await res.json();

          if (data?.role === "admin" || data?.role === "worker") {
            setRole(data.role);
          } else {
            console.warn("User role not found or unauthorized");
            router.replace("/(auth)/sign-in");
          }
        } catch (err) {
          console.error("Failed to load role:", err);
          router.replace("/(auth)/sign-in");
        } finally {
          setLoadingRole(false);
        }
      }
    };

    getRole();
  }, [isSignedIn, email]);

  if (loadingRole) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (role === "admin") {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/start" />;
  }
};

export default Home;
