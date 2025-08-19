import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const Home = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href="/start" />;
};

export default Home;
