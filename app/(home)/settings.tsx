import { useTheme } from "@/components/theme/theme-context";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { CircleCheck, Palette, Timer } from "lucide-react-native";
import React, { useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView, Switch } from "react-native-gesture-handler";

type Theme = "light" | "dark" | "system";

const SettingsScreen = () => {
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoro, setAutoStartPomodoro] = useState(false);
  const [autoCheckTasks, setAutoCheckTasks] = useState(false);
  const [autoSwitchTasks, setAutoSwitchTasks] = useState(false);

  const { theme, setTheme, currentColors } = useTheme();
  const { background, foreground, primary, tertiary, muted, secondary } =
    currentColors;

  const handleThemeChange = (value: string) => {
    const newTheme = value as Theme;
    setTheme(newTheme);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaWrapper className="bg-background px-4 pb-8">
        <View className="flex-1 gap-6 mt-12">
          <H3 className="text-center">Settings</H3>
          <View className="mt-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Timer size={20} color={foreground} />
              <H3>Timer</H3>
            </View>
            <View className="flex-row justify-between items-center">
              <Text>Auto Start Breaks</Text>
              <Switch
                value={autoStartBreaks}
                onValueChange={setAutoStartBreaks}
                trackColor={{ false: muted, true: primary }}
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text>Auto Start Pomodoro</Text>
              <Switch
                value={autoStartPomodoro}
                onValueChange={setAutoStartPomodoro}
                trackColor={{ false: muted, true: primary }}
              />
            </View>
          </View>
          <View className="mt-4">
            <View className="flex-row items-center gap-2 mb-2">
              <CircleCheck size={20} color={foreground} />
              <H3>Task</H3>
            </View>
            <View className="flex-row justify-between items-center">
              <Text>Auto Check Task</Text>
              <Switch
                value={autoCheckTasks}
                onValueChange={setAutoCheckTasks}
                trackColor={{ false: muted, true: primary }}
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text>Auto Switch Tasks</Text>
              <Switch
                value={autoSwitchTasks}
                onValueChange={setAutoSwitchTasks}
                trackColor={{ false: muted, true: primary }}
              />
            </View>
          </View>
          <View className="flex-row items-center gap-2 mb-2">
            <Palette size={20} color={foreground} />
            <H3>Theme</H3>
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <Text>App Theme</Text>
            {/* <Picker
            selectedValue={theme}
            onValueChange={handleThemeChange}
            style={{ flex: 1 }}
          >
            <Picker.Item label="System" value="system" />
            <Picker.Item label="Light" value="light" />
            <Picker.Item label="Dark" value="dark" />
          </Picker> */}
          </View>
        </View>
      </SafeAreaWrapper>
    </GestureHandlerRootView>
  );
};

export default SettingsScreen;
