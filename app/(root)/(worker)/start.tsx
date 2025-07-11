import { Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/SignOutButton";
import { LOCATION_TASK_NAME } from "@/lib/locationTask";
import { fetchAPI } from "@/lib/fetch";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

function Start() {
  const { user } = useUser();
  const [shiftId, setShiftId] = useState<number | null>(null);

  useEffect(() => {
    const checkActiveShift = async () => {
      if (!user) return;

      try {
        const storedId = await AsyncStorage.getItem("activeShiftId");
        if (storedId) {
          setShiftId(Number(storedId));
        }
      } catch (err) {
        console.error("❌ Error reading SecureStore:", err);
      }
    };

    checkActiveShift();
  }, [user]);

  const startShift = async () => {
    try {
      const { status: fgStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted")
        return Alert.alert("Нет разрешения на геолокацию");

      const { status: bgStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") return Alert.alert("Нет фона геолокации");

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return Alert.alert("No permission");

      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return Alert.alert("No email");

      await SecureStore.setItemAsync("userEmail", email);

      // Start location tracking
      const isRunning =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!isRunning) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10 * 1000,
          distanceInterval: 0,
          foregroundService: {
            notificationTitle: "Tracking location",
            notificationBody: "Your location is being used in background",
          },
          showsBackgroundLocationIndicator: true,
          pausesUpdatesAutomatically: false,
        });
      }

      // Create shift
      const data = await fetchAPI("/(api)/shift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await AsyncStorage.setItem("activeShiftId", String(data.id));
      setShiftId(data.id);

      Alert.alert("Смена началась");
    } catch (err) {
      console.error("❌ Error starting shift:", err);
    }
  };

  const endShift = async (id: number) => {
    try {
      await fetchAPI("/(api)/shiftend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shift_id: id }),
      });

      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setShiftId(null);
      await AsyncStorage.removeItem("activeShiftId");
      setShiftId(null);
      Alert.alert("Смена закончена");
    } catch (err) {
      console.error("Error ending shift:", err);
    }
  };

  return (
    <View className="flex-1 items-center justify-center space-y-6">
      <Text className="text-lg font-bold">Привет Работник</Text>

      {/* Only show if shift is not active */}
      {!shiftId ? (
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-lg"
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
                { text: "Закончить", onPress: () => endShift(shiftId) },
              ]
            );
          }}
        >
          <Text className="text-white">Закончить смену</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity className="px-6 py-3 rounded-lg">
        <SignOutButton />
      </TouchableOpacity>
    </View>
  );
}

export default Start;
