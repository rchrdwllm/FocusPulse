import { useTheme } from "@/components/theme/theme-context";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { useSettings } from "@/hooks/useSettings";
import {
  changeAutoStartBreaks,
  changeAutoStartPomodoro,
} from "@/server/settings";
import { Picker } from "@react-native-picker/picker";
import { CircleCheck, Palette, Timer } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView, Switch } from "react-native-gesture-handler";

type Theme = "light" | "dark" | "system";

const SettingsScreen = () => {
  const { settings, loading, error } = useSettings();
  const [autoStartBreaks, setAutoStartBreaks] = useState(
    loading ? true : settings?.autoStartBreaks
  );
  const [autoStartPomodoro, setAutoStartPomodoro] = useState(
    loading ? true : settings?.autoStartPomodoro
  );
  const [autoCheckTasks, setAutoCheckTasks] = useState(loading);
  const [autoSwitchTasks, setAutoSwitchTasks] = useState(loading);

  const { theme, setTheme, currentColors } = useTheme();
  const { foreground, primary, muted, background } = currentColors;

  useEffect(() => {
    StatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content");
  }, [theme, currentColors]);

  if (error) throw new Error(error.message);

  useEffect(() => {
    if (settings) {
      setAutoStartBreaks(settings.autoStartBreaks);
      setAutoStartPomodoro(settings.autoStartPomodoro);
    }
  }, [settings]);

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
  };

  const handleAutoStartBreaksChange = async (value: boolean) => {
    setAutoStartBreaks(value);

    const { error } = await changeAutoStartBreaks();

    if (error) {
      setAutoStartBreaks(!value);
    }
  };

  const handleAutoStartPomodoro = async (value: boolean) => {
    setAutoStartPomodoro(value);

    const { error } = await changeAutoStartPomodoro();

    if (error) {
      setAutoStartPomodoro(!value);
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1, backgroundColor: background }}>
        <SafeAreaWrapper className={`px-4 pb-8`}>
          <View className="flex-1 gap-6 ">
            <H3 className="text-center">Settings</H3>
            <View className="mt-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Timer size={20} color={foreground} />
                <Text
                  style={{
                    color: foreground,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Timer
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text style={{ color: foreground }}>Auto Start Breaks</Text>
                <Switch
                  value={autoStartBreaks}
                  onValueChange={handleAutoStartBreaksChange}
                  trackColor={{ false: muted, true: primary }}
                  thumbColor={"white"}
                />
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text style={{ color: foreground }}>Auto Start Pomodoro</Text>
                <Switch
                  value={autoStartPomodoro}
                  onValueChange={handleAutoStartPomodoro}
                  trackColor={{ false: muted, true: primary }}
                  thumbColor={"white"}
                />
              </View>
            </View>
            <View className="mt-4">
              <View className="flex-row items-center gap-2 mb-2">
                <CircleCheck size={20} color={foreground} />
                <Text
                  style={{
                    color: foreground,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Task
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text style={{ color: foreground }}>Auto Check Task</Text>
                <Switch
                  value={autoCheckTasks}
                  onValueChange={setAutoCheckTasks}
                  trackColor={{ false: muted, true: primary }}
                  thumbColor={"white"}
                />
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text style={{ color: foreground }}>Auto Switch Tasks</Text>
                <Switch
                  value={autoSwitchTasks}
                  onValueChange={setAutoSwitchTasks}
                  trackColor={{ false: muted, true: primary }}
                  thumbColor={"white"}
                />
              </View>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Palette size={20} color={foreground} />
              <Text
                style={{ color: foreground, fontSize: 18, fontWeight: "bold" }}
              >
                Theme
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-4">
              <Text style={{ color: foreground }}>App Theme</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Picker
                selectedValue={theme}
                onValueChange={(itemValue) =>
                  handleThemeChange(itemValue as Theme)
                }
                style={{
                  flex: 1,
                }}
                itemStyle={{ backgroundColor: background }}
              >
                <Picker.Item label="System" value="system" color={foreground} />
                <Picker.Item label="Light" value="light" color={foreground} />
                <Picker.Item label="Dark" value="dark" color={foreground} />
              </Picker>
            </View>
          </View>
        </SafeAreaWrapper>
      </View>
    </GestureHandlerRootView>
  );
};

export default SettingsScreen;
