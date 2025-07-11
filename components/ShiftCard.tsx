import { formatStartTime, formatTime } from "@/lib/utils";
import { Shift } from "@/types/type";
import { View, Text } from "react-native";

function ShiftCard({
  shift: { start_time, duration, user_name, user_email, status },
}: {
  shift: Shift;
}) {
  return (
    <View className="bg-white p-4 m-2 rounded-xl shadow-sm">
      <View className="flex-row items-center mb-3">
        <Text className="text-lg font-semibold mr-1">{user_name}</Text>
        <Text className="text-gray-400">|</Text>
        <Text className="text-gray-500 ml-1">{user_email}</Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">⏰ Старт:</Text>
        <Text className="text-gray-900">{formatStartTime(start_time)}</Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">⏱️ Длительность:</Text>
        <Text className="text-gray-900">{formatTime(duration)}</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-600">📋 Статус:</Text>
        <Text
          className={`font-semibold ${
            status === "Закончена" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {status}
        </Text>
      </View>
    </View>
  );
}

export default ShiftCard;
