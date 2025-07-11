import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { isLoaded, signUp, setActive } = useSignUp();

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      if (result.status === "complete") {
        // Create a database user
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: result.id,
            role: "worker",
          }),
        });

        await setActive({ session: result.createdSessionId });
      } else {
        console.error("Unexpected sign-up state:", result);
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.greentruck} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Создать Аккаунт
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Имя"
            placeholder="Впишите свое имя"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
            title="Зарегистрироваться"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Уже есть Аккаунт? </Text>
            <Text className="text-primary-500">Войти</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
