import {
  View,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { H1 } from "@/components/Typography";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
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
} from "@/components/alert-dialog";
import { useEffect, useState } from "react";
import { createAccount } from "@/server/actions";

const signUpBg = require("@/assets/images/sign-up-bg.png");
const authLogo = require("@/assets/images/focus-pulse-auth-logo.png");

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

  const handleSignUp = async (data: z.infer<typeof registerSchema>) => {
    setOpen(true);

    const { success, error } = await createAccount(data.email, data.password);

    setOpen(false);

    if (success) {
      router.replace("/(home)");
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
                  source={authLogo}
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
                        className="rounded-xl"
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
                        className="rounded-xl"
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
                <Text>Sign up</Text>
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
