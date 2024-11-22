import NavTab from "@/components/ui/nav-tab";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { Tabs } from "expo-router";
import {
  Circle,
  CircleUserRound,
  Clock,
  Settings2,
  SquarePen,
} from "lucide-react-native";
import React from "react";
import { StatusBar, View } from "react-native";
import { ThemeProvider, useTheme } from "../../components/theme/theme-context";

const Layout: React.FC = () => {
  const { theme, currentColors } = useTheme();
  const { background, primary, muted } = currentColors;

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
      <SafeAreaWrapper>
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: background,
          borderTopWidth: 0,
          height: 60,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
      initialRouteName="(index)"
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
        name="(index)"
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
          title: "New timer",
          tabBarIcon: ({ focused }) => (
            <NavTab>
              <Clock size={28} color={focused ? primary : muted} />
            </NavTab>
          ),
        }}
        name="timer"
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
        name="setting-screen"
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
      </SafeAreaWrapper>
      </View>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
};

export default App;
