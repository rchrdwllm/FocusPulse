import {
  View,
  ImageBackground,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H1 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/login-schema";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { login } from "@/server/actions";
import { useTheme } from "@/components/theme/theme-context";

const loginBg = require("@/assets/images/login-bg.png");
const authLogoLight = require("@/assets/images/focus-pulse-auth-logo-light.png");
const authLogoDark = require("@/assets/images/focus-pulse-auth-logo-dark.png");

const LoginScreen = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const [open, setOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    currentColors: { muted },
    theme,
  } = useTheme();

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setOpen(true);

    const { success, error } = await login(data.email, data.password);

    setOpen(false);

    if (success) {
      router.replace("/(home)/(index)");
    } else if (error) {
      setLoginError(JSON.stringify(error));
    }
  };

  useEffect(() => {
    if (loginError) {
      Alert.alert("Error while logging in", loginError, [
        {
          text: "Okay",
          onPress: () => setLoginError(null),
        },
      ]);
    }
  }, [loginError]);

  return (
    <>
      <View className="flex-1">
        <ImageBackground
          className="flex-1 bg-background"
          source={loginBg}
          resizeMode="cover"
        >
          <SafeAreaWrapper className="pb-12">
            <View className="flex-1 mt-8">
              <View className="items-center">
                <Image
                  source={theme === "light" ? authLogoDark : authLogoLight}
                  className="w-1/2 h-[195]"
                  resizeMode="contain"
                />
              </View>
              <H1 className="text-center">Login</H1>
              <View className="px-8 gap-4 mt-8">
                <View className="flex-col gap-1">
                  <Controller
                    control={form.control}
                    rules={{
                      required: true,
                    }}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Email"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {form.formState.errors.email && (
                    <Text className="text-red-500">
                      {form.formState.errors.email.message}
                    </Text>
                  )}
                </View>
                <View className="flex-col gap-2">
                  <Controller
                    control={form.control}
                    rules={{
                      required: true,
                    }}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Password"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        secureTextEntry
                      />
                    )}
                  />
                  {form.formState.errors.password && (
                    <Text className="text-red-500">
                      {form.formState.errors.password.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View className="px-8 gap-4">
              <Button onPress={form.handleSubmit(handleLogin)}>
                <Text>Login</Text>
              </Button>
              <View className="items-center">
                <Link href="/sign-up">
                  <Text className="text-center" style={{ color: muted }}>
                    Don't have an account yet? Register here
                  </Text>
                </Link>
              </View>
            </View>
          </SafeAreaWrapper>
        </ImageBackground>
      </View>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logging in</AlertDialogTitle>
          </AlertDialogHeader>
          <ActivityIndicator className="text-primary" />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LoginScreen;
