import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";
import { fetchAPI } from "@/lib/fetch";
import { LocationObject } from "expo-location";

export const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";

// prettier-ignore
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error("Location Task Error:", error);
      return;
    }
    const { locations } = data as { locations: LocationObject[] };
    console.log("Received new locations", locations);
    const location = locations[0];
    if (!location) return;

    const email = await SecureStore.getItemAsync("userEmail");
    if (!email) return;

    console.log("Received new locations", location);

    await fetchAPI("/(api)/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }),
    });
  }
);
