import { SignOutButton } from "@/components/SignOutButton";
import { useAuth } from "@/contexts/auth-context";
import { fetchAPI } from "@/lib/fetch";
import { LOCATION_TASK_NAME } from "@/lib/locationTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(utc);
dayjs.extend(timezone);

function Start() {
  const { name } = useAuth();
  const [shiftId, setShiftId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const checkActiveShift = async () => {
    try {
      const storedId = await AsyncStorage.getItem("activeShiftId");
      setShiftId(storedId ? Number(storedId) : null);
    } catch (err) {
      console.error("❌ Error reading SecureStore:", err);
    }
  };

  useEffect(() => {
    // async function registerForPushNotificationsAsync() {
    //   let expoPushToken;
    //   if (!Device.isDevice) {
    //     Alert.alert("❌ Must use a physical device for Push Notifications");
    //     return;
    //   }
    //   // Request notification permissions
    //   const { status: existingStatus } =
    //     await Notifications.getPermissionsAsync();
    //   let finalStatus = existingStatus;
    //   if (existingStatus !== "granted") {
    //     const { status } = await Notifications.requestPermissionsAsync();
    //     finalStatus = status;
    //   }
    //   if (finalStatus !== "granted") {
    //     Alert.alert("⚠️ Failed to get push token for notifications");
    //     return;
    //   }
    //   try {
    //     const tokenData = await Notifications.getExpoPushTokenAsync({
    //       projectId: "23798b3a-6caf-4132-9311-a0aa06551f56",
    //     });
    //     console.log("Expo Push Token:", tokenData.data);
    //   } catch (err) {
    //     console.error("Error getting Expo push token:", err);
    //   }
    //   // Get Expo push token
    //   const tokenData = await Notifications.getExpoPushTokenAsync({
    //     projectId: "23798b3a-6caf-4132-9311-a0aa06551f56",
    //   });
    //   expoPushToken = tokenData.data;
    //   console.log("📲 Expo Push Token:", expoPushToken);
    //   // Get JWT from storage
    //   const jwt = await SecureStore.getItemAsync("jwt_token");
    //   if (!jwt) {
    //     console.warn(
    //       "⚠️ No JWT token found, cannot send push token to backend"
    //     );
    //     return expoPushToken;
    //   }
    //   // Send push token to backend
    //   await fetchAPI("https://shiftapp.onrender.com/api/users/expo-token", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${jwt}`,
    //     },
    //     body: JSON.stringify({ expoPushToken }),
    //   });
    //   // Android-specific notification channel
    //   if (Platform.OS === "android") {
    //     Notifications.setNotificationChannelAsync("default", {
    //       name: "default",
    //       importance: Notifications.AndroidImportance.MAX,
    //       vibrationPattern: [0, 250, 250, 250],
    //       lightColor: "#FF231F7C",
    //     });
    //   }
    //   return expoPushToken;
    // }
    // registerForPushNotificationsAsync();
    checkActiveShift();
  }, []);

  // manual refresh of the page
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await checkActiveShift();
    setRefreshing(false);
  }, []);

  const startShift = async () => {
    try {
      const { status: fgStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted")
        return Alert.alert("Нет разрешения на геолокацию");

      const { status: bgStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") return Alert.alert("Нет фона геолокации");

      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token) return Alert.alert("❌ No JWT token found");

      // Create shift
      const response = await fetchAPI("https://shifts.kz/api/shifts/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 400) {
        Alert.alert("Внимание", response.message);
      }

      await AsyncStorage.setItem("activeShiftId", String(response.shift.id));
      setShiftId(response.shift.id);

      // Start location tracking
      const isRunning =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!isRunning) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 600000,
          distanceInterval: 3,
          foregroundService: {
            notificationTitle: "Tracking location",
            notificationBody: "Your location is being used in background",
          },
          showsBackgroundLocationIndicator: true,
          pausesUpdatesAutomatically: false,
        });
      }

      Alert.alert("Смена началась");
    } catch (err) {
      console.error("❌ Error starting shift:", err);
    }
  };

  const stopTracking = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    await AsyncStorage.removeItem("activeShiftId");
    Alert.alert("✅ Принудительно закончили трекинг");
  };

  const endShift = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token)
        return Alert.alert("❌ No token found", "Please log in again");

      const res = await fetchAPI("https://shifts.kz/api/shifts/end", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setShiftId(null);
      await AsyncStorage.removeItem("activeShiftId");
      Alert.alert("✅ Смена завершена", `Сменa окончена: ${res.shift.endedAt}`);
    } catch (err) {
      console.error("Error ending shift:", err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          titleColor="#010101"
          title="Обновляем..."
        />
      }
    >
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-semibold flex-1 flex-shrink">
            Привет{name ? `, ${name}` : " Работник"} 👋
          </Text>
          <TouchableOpacity className="ml-2 p-2">
            <SignOutButton />
          </TouchableOpacity>
        </View>
        {/* Only show if shift is not active */}
        <View className="flex-1 justify-center items-center">
          {!shiftId ? (
            <TouchableOpacity
              className="bg-green-500 px-6 py-4 rounded-lg"
              onPress={startShift}
            >
              <Text className="text-white">Начать смену</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-red-500 px-6 py-3 rounded-lg"
              onPress={() => {
                Alert.alert(
                  "Закончить смену?",
                  "Вы уверены что хотите закончить смену сейчас?",
                  [
                    { text: "Отменить", style: "cancel" },
                    { text: "Закончить", onPress: () => endShift() },
                  ]
                );
              }}
            >
              <Text className="text-white">Закончить смену</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-lg"
          onPress={stopTracking}
        >
          <Text className="text-white">Остановить</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

export default Start;
