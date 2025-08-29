import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Alert, Platform } from "react-native";
import { fetchAPI } from "./fetch";

export async function registerForPushNotificationsAsync() {
  let expoPushToken;

  if (!Device.isDevice) {
    Alert.alert("❌ Must use a physical device for Push Notifications");
    return;
  }

  // Request notification permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("⚠️ Failed to get push token for notifications");
    return;
  }

  // Get Expo push token
  expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("📲 Expo Push Token:", expoPushToken);

  // Get JWT from storage
  const jwt = await SecureStore.getItemAsync("jwt_token");
  if (!jwt) {
    console.warn("⚠️ No JWT token found, cannot send push token to backend");
    return expoPushToken;
  }

  // Send push token to backend
  await fetchAPI("https://shifts.kz/api/users/expo-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ expoPushToken }),
  });

  // Android-specific notification channel
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return expoPushToken;
}
