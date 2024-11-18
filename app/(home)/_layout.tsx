import NavTab from "@/components/ui/nav-tab";
import { colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import { Circle, Clock, Settings2, SquarePen, CircleUserRound } from "lucide-react-native";
import { useColorScheme } from "react-native";

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
          title: "New timer",
          tabBarIcon: ({ focused }) => (
            <NavTab>
              <Clock size={28} color={focused ? primary : muted} />
            </NavTab>
          ),
        }}
        name="new-timer"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "New task",
          tabBarIcon: ({ focused }) => (
            <NavTab>
              <SquarePen size={28} color={focused ? primary : muted} />
            </NavTab>
          ),
        }}
        name="new-task"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <NavTab>
              <Settings2 size={28} color={focused ? primary : muted} />
            </NavTab>
          ),
        }}
        name="asdf"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "User Profile",
          tabBarIcon: ({ focused }) => (
            <NavTab>
              <CircleUserRound size={28} color={focused ? primary : muted} />
            </NavTab>
          ),
        }}
        name="profile-screen"
      />
    </Tabs>
  );
};

export default HomeLayout;
