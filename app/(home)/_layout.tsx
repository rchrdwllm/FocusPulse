import { useColorScheme } from "react-native";
import { Tabs } from "expo-router";
import { Circle, Clock } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";
import NavTab from "@/components/ui/nav-tab";

const HomeLayout = () => {
  const colorScheme = useColorScheme() || "light";
  const { background, primary, muted } = colors[colorScheme];

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
          tabBarIcon: ({ focused }) => (
            <NavTab>
              <Circle size={28} color={focused ? primary : muted} />
            </NavTab>
          ),
        }}
        name="index"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "New",
          tabBarIcon: ({ focused }) => (
            <NavTab>
              <Clock size={28} color={focused ? primary : muted} />
            </NavTab>
          ),
        }}
        name="new-timer"
      />
    </Tabs>
  );
};

export default HomeLayout;
