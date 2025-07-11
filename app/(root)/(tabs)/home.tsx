import ShiftCard from "@/components/ShiftCard";
import { SignOutButton } from "@/components/SignOutButton";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [recentShifts, setRecentShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getShifts = async () => {
      try {
        setLoading(true);
        const data = await fetchAPI("/(api)/shifts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setRecentShifts(data || []);
      } catch (err) {
        console.error("❌ Error loading shifts:", err);
      } finally {
        setLoading(false);
      }
    };

    getShifts();
  }, []);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentShifts?.slice(0, 5)}
        renderItem={({ item }) => <ShiftCard shift={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No Shifts found"
                  resizeMode="contain"
                />
                <Text className="text-sm">Ни одной смены не найдено</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl font-JakartaExtraBold">
                Добро пожаловать, Админ.
              </Text>
              <TouchableOpacity>
                <SignOutButton />
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
