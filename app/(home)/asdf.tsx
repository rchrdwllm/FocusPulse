import { useTheme } from "@/components/theme/theme-context";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { Picker } from "@react-native-picker/picker";
import { CircleCheck, Palette, Timer } from "lucide-react-native";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView, Switch } from "react-native-gesture-handler";


type Theme = "light" | "dark" | "system"; 

const SettingsScreen = () => {
    
    const [autoStartBreaks, setAutoStartBreaks] = useState(false);
    const [autoStartPomodoro, setAutoStartPomodoro] = useState(false);
    const [autoCheckTasks, setAutoCheckTasks] = useState(false);
    const [autoSwitchTasks, setAutoSwitchTasks] = useState(false);

    const { theme, setTheme, currentColors } = useTheme();
    const { background, foreground, primary, tertiary, muted } = currentColors;

    const handleThemeChange = (value: string) => {
        const newTheme = value as Theme
        setTheme(newTheme);
    };


    return (
        <GestureHandlerRootView>
            <SafeAreaWrapper className="bg-background px-4 pb-8">
                <View className="flex-1 gap-6 mt-8"> </View>
                    <H3 className="text-center">Settings</H3>


                    {/* Timer Section */}
                    <View className="mt-4">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Timer size={20} color={foreground} />
                            <H3 style={{ color: foreground }}>Timer</H3>
                        </View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text style={{ color: foreground }}>Auto Start Breaks</Text>
                            <Switch
                                value={false}
                                onValueChange={setAutoStartBreaks}
                                trackColor={{ false: muted, true: primary }}
                            />
                        </View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text style={{ color: foreground }}>Auto Start Pomodoro</Text>
                            <Switch
                                value={false}
                                onValueChange={setAutoStartPomodoro}
                                trackColor={{ false: muted, true: primary }}
                            />
                        </View>
                    </View>

                    {/* Task Section */}
                    <View className="mt-4">
                        <View className="flex-row items-center gap-2 mb-2">
                            <CircleCheck size={20} color={foreground} />
                            <H3 style={{ color: foreground }}>Task</H3>
                        </View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text style={{ color: foreground }}>Auto Check Task</Text>
                            <Switch
                                value={false}
                                onValueChange={setAutoCheckTasks}
                                trackColor={{ false: muted, true: primary }}
                            />
                        </View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text style={{ color: foreground }}>Auto Switch Tasks</Text>
                            <Switch
                                value={false}
                                onValueChange={setAutoSwitchTasks}
                                trackColor={{ false: muted, true: primary }}
                            />
                        </View>
                    </View>
                    
                    {/* Theme Section */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-2">
                            <Palette size={20} color={foreground} />
                            <H3 style={{ color: foreground }}>Theme</H3>
                        </View>

                        <View className="flex-row justify-between items-center mb-4">
                            <Text style={{ color: foreground }}>App Theme</Text>
    
                            <Picker
                                selectedValue={theme}
                                onValueChange={handleThemeChange}
                                style={{ flex: 1 }}>
                                
                                <Picker.Item label="System" value="system" />
                                <Picker.Item label="Light" value="light" />
                                <Picker.Item label="Dark" value="dark" />
                            </Picker>
                    </View>

                </View>
            </SafeAreaWrapper>
        </GestureHandlerRootView>
    )
};

export default SettingsScreen;
