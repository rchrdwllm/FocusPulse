import { ThemeProvider } from "@/components/theme/theme-context";
import { colors } from "@/constants/colors";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { PortalHost } from "@rn-primitives/portal";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import "../global.css";
import React from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });
  const colorScheme = useColorScheme() || "light";
  const { background } = colors[colorScheme];

  Platform.OS === "android" &&
    NavigationBar.setBackgroundColorAsync(background);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar />
      <Stack initialRouteName="(auth)">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
};

export default RootLayout;
