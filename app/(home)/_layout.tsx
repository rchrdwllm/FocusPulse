import { useColorScheme } from "react-native";
import { Tabs } from "expo-router";
import { Circle, Clock } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

const HomeLayout = () => {
  const colorScheme = useColorScheme() || "light";
  const { background } = colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: "transparent",
        },
        tabBarShowLabel: false,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "Timer",
          tabBarIcon: ({ focused, color }) => (
            <Circle
              className={cn(focused ? "text-primary" : "text-muted")}
              size={28}
              color={color}
            />
          ),
        }}
        name="index"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "New",
          tabBarIcon: ({ focused, color }) => (
            <Clock
              className={cn(focused ? "text-primary" : "text-muted")}
              size={28}
              color={color}
            />
          ),
        }}
        name="new-timer"
      />
    </Tabs>
  );
};

export default HomeLayout;
