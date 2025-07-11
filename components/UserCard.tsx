import { Text, View } from "react-native";
import React from "react";
import { User } from "@/types/type";

function UserCard({ user: { id, name, email, role } }: { user: User }) {
  return (
    <View className="bg-white rounded-xl shadow-sm px-4 py-3 mb-4">
      <Text className="text-lg font-JakartaBold text-gray-800 mb-1">{`id: ${id}`}</Text>

      <View className="flex-row">
        <View className="flex-1">
          <Text className="text-sm text-gray-500">Name</Text>
          <Text className="text-sm text-gray-800">{name}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-sm text-gray-500">Email</Text>
          <Text className="text-sm text-gray-800">{email}</Text>
        </View>

        <View>
          <Text className="text-sm text-gray-500">Role</Text>
          <Text className="text-sm text-gray-800">{role}</Text>
        </View>
      </View>
    </View>
  );
}

export default UserCard;
