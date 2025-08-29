import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { useAuth } from "@/contexts/auth-context";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const { login } = useAuth();

  const router = useRouter();

  const onSignInPress = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Ошибка", "Заполните все поля");
      return;
    }

    try {
      const response = await axios.post(
        "https://shifts.kz/api/auth/login",
        // eslint-disable-next-line prettier/prettier
        form
      );
      const token = response.data.token;
      await login(token);

      router.replace("/(root)/(worker)/start");
    } catch (err: any) {
      Alert.alert("Ошибка", err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.greentruck} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Войти
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Почта"
            placeholder="Впишите свою почту"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Пароль"
            placeholder="Впишите свой пароль"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Войти"
            onPress={onSignInPress}
            className="mt-6"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
