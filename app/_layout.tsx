import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { useFonts } from "expo-font";
import { PortalHost } from "@rn-primitives/portal";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    InriaSansRegular: require("../assets/fonts/InriaSans-Regular.ttf"),
    InriaSansBold: require("../assets/fonts/InriaSans-Bold.ttf"),
    InriaSansItalic: require("../assets/fonts/InriaSans-Italic.ttf"),
  });

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
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </>
  );
};

export default RootLayout;
