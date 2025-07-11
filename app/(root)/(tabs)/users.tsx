import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStore } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { SignOutButton } from "@/components/SignOutButton";
import UserCard from "@/components/UserCard";

const Users = () => {
  const { users } = useUserStore();
  const loading = false;

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={users}
        renderItem={({ item }) => <UserCard user={item} />}
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
                <Text className="text-sm">
                  Ни одного пользователя не найдено
                </Text>
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

export default Users;
