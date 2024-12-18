import React from "react";

import {
  View,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from "react-native";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H1 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { registerSchema } from "@/schemas/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { createAccount } from "@/server/actions";

const signUpBg = require("@/assets/images/sign-up-bg.png");
const authLogoLight = require("@/assets/images/focus-pulse-auth-logo-light.png");
const authLogoDark = require("@/assets/images/focus-pulse-auth-logo-dark.png");

const SignUpScreen = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });
  const [open, setOpen] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const colorScheme = useColorScheme() || "light";

  const handleSignUp = async (data: z.infer<typeof registerSchema>) => {
    setOpen(true);

    const { success, error } = await createAccount(data.email, data.password);

    setOpen(false);

    if (success) {
      router.replace("/(home)/(index)");
    } else if (error) {
      setRegisterError(JSON.stringify(error));
    }
  };

  useEffect(() => {
    if (registerError) {
      Alert.alert(registerError);
    }
  }, [registerError]);

  return (
    <>
      <View className="flex-1">
        <ImageBackground
          className="flex-1 bg-background"
          source={signUpBg}
          resizeMode="cover"
        >
          <SafeAreaWrapper className="pb-12">
            <View className="flex-1 mt-8">
              <View className="items-center">
                <Image
                  source={
                    colorScheme === "light" ? authLogoDark : authLogoLight
                  }
                  className="w-1/2 h-[195]"
                  resizeMode="contain"
                />
              </View>
              <H1 className="text-center">Sign up</H1>
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
              <Button onPress={form.handleSubmit(handleSignUp)}>
                <Text style={{ color: "white" }}>Sign up</Text>
              </Button>
              <View className="items-center">
                <Link href="/">
                  <Text className="text-center text-muted">
                    Already have an account? Login here
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
            <AlertDialogTitle>Creating your account</AlertDialogTitle>
          </AlertDialogHeader>
          <ActivityIndicator className="text-primary" />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SignUpScreen;
