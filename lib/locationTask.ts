// prettier-ignore
import { fetchAPI } from "@/lib/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import * as TaskManager from "expo-task-manager";
import { Alert } from "react-native";

export const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Location Task Error:", error);
    return;
  }
  const { locations } = data as { locations: Location.LocationObject[] };
  const location = locations[0];
  if (!location) return;

  const token = await SecureStore.getItemAsync("jwt_token");
  const shiftId = await AsyncStorage.getItem("activeShiftId");

  if (!token || !shiftId) {
    console.warn("Missing token or shiftId");
    return;
  }

  try {
    // Check if backend still has this shift active
    const res = await fetchAPI(
      "https://shiftapp.onrender.com/api/shifts/active",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res) {
      // shift ended on server → stop background task
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      await AsyncStorage.removeItem("activeShiftId");
      Alert.alert("Shift ended remotely. Stopping geofetching.");
      return;
    }

    // If active → send current location
    const timestamp = location.timestamp;
    const { latitude, longitude } = location.coords;
    console.log("📍 Location captured:", { latitude, longitude, timestamp });

    await fetchAPI("https://shiftapp.onrender.com/api/shifts/shift-location", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shiftId,
        lat: latitude,
        lng: longitude,
        timestamp,
      }),
    });
  } catch (err) {
    console.error("Error in location task", err);
  }
});
