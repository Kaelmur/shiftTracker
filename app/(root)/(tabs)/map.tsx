import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { useUserStore } from "@/store";
import { icons } from "@/constants";

type User = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
};

const INITIAL_REGION = {
  latitude: 44.84,
  longitude: 65.5,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

const Map = () => {
  const mapRef = useRef<any>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUserLocations = async () => {
    try {
      const res = await fetch("/(api)/location");
      const data = await res.json();
      useUserStore.getState().setUsers(data);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      Alert.alert("Error", "Could not load user locations.");
    }
  };

  useEffect(() => {
    fetchUserLocations();
  }, []);

  const centerToUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location access is needed.");
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current?.animateToRegion(region, 1000);
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
      >
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: parseFloat(user.latitude),
              longitude: parseFloat(user.longitude),
            }}
          >
            <Image
              source={icons.point}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
              }}
            />
            <Text className="text-black">{user.name}</Text>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        className="absolute top-28 right-5 bg-blue-500 p-3 rounded-full shadow-lg"
        onPress={centerToUserLocation}
      >
        <Text className="text-white text-xl">📍</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Map;
