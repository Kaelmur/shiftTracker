import { fetchAPI } from "@/lib/fetch";
import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { deleteLocation, getOfflineLocations } from "./db";

export const setupSync = () => {
  NetInfo.addEventListener(async (state) => {
    if (state.isConnected) {
      await flushOfflineLocations();
    }
  });
};

export const flushOfflineLocations = async () => {
  const token = await SecureStore.getItemAsync("jwt_token");
  if (!token) return;

  const locations = await getOfflineLocations();
  if (!locations.length) return;

  for (const loc of locations) {
    try {
      await fetchAPI("https://shifts.kz/api/shifts/shift-location", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shiftId: loc.shiftId,
          lat: loc.latitude,
          lng: loc.longitude,
          timestamp: loc.timestamp,
        }),
      });

      // ✅ delete after successful upload
      await deleteLocation(loc.id);
      console.log("☁️ Synced offline location → server:", loc);
    } catch (err) {
      console.error("❌ Failed syncing location:", err);
      break; // stop loop if server is failing
    }
  }
};
