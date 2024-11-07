import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
};

export default AuthLayout;
