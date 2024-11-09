import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { useFonts } from "expo-font";
import { PortalHost } from "@rn-primitives/portal";
import * as NavigationBar from "expo-navigation-bar";
import { colors } from "@/constants/colors";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    InriaSansRegular: require("../assets/fonts/InriaSans-Regular.ttf"),
    InriaSansBold: require("../assets/fonts/InriaSans-Bold.ttf"),
    InriaSansItalic: require("../assets/fonts/InriaSans-Italic.ttf"),
  });
  const colorScheme = useColorScheme() || "light";
  const { background } = colors[colorScheme];

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
    <>
      <Stack initialRouteName="(home)">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </>
  );
};

export default RootLayout;
