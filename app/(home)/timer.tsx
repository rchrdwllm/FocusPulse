import React from "react";

import SessionPreset from "@/components/countdown-timer/session-preset";
import SessionPickerModal from "@/components/modals/session-picker-modal";
import TimePickerModal from "@/components/modals/time-picker-modal";
import { useTheme } from "@/components/theme/theme-context";
import { Button } from "@/components/ui/button";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { Text } from "@/components/ui/text";
import { H3, H4 } from "@/components/ui/typography";
import { sessionPresets } from "@/constants/session-presets";
import { buttonSpring } from "@/constants/spring";
import { formatDuration } from "@/lib/utils";
import { initUserSettings } from "@/server/settings";
import { SessionPreset as SessionPresetType } from "@/types";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ScrollView } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NewTimerScreen = () => {
  const [showFocusPicker, setShowFocusPicker] = useState(false);
  const [showShortPicker, setShowShortPicker] = useState(false);
  const [showLongPicker, setShowLongPicker] = useState(false);
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const focusPressableScale = useSharedValue(1);
  const shortPressableScale = useSharedValue(1);
  const longPressableScale = useSharedValue(1);
  const sessionPressableScale = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);
  const [focusDuration, setFocusDuration] = useState(1500);
  const [shortDuration, setShortDuration] = useState(300);
  const [longDuration, setLongDuration] = useState(900);
  const [sessions, setSessions] = useState(4);
  const formattedFocus = useMemo(() => {
    return formatDuration(focusDuration);
  }, [focusDuration]);
  const formattedShort = useMemo(() => {
    return formatDuration(shortDuration);
  }, [shortDuration]);
  const formattedLong = useMemo(() => {
    return formatDuration(longDuration);
  }, [longDuration]);
  const formattedSessions = useMemo(() => {
    return sessions > 1 ? `${sessions} sessions` : `${sessions} session`;
  }, [sessions]);
  const [newTimerKey, setNewTimerKey] = useState(0);
  const {
    currentColors: { background, input, border, muted, foreground, primary },
  } = useTheme();

  useEffect(() => {
    initUserSettings();
  }, []);

  useEffect(() => {
    if (
      showFocusPicker ||
      showShortPicker ||
      showLongPicker ||
      showSessionPicker
    ) {
      containerScale.value = withTiming(0.8);
      containerOpacity.value = withTiming(0.3);
    } else {
      containerScale.value = withTiming(1);
      containerOpacity.value = withTiming(1);
    }
  }, [showFocusPicker, showShortPicker, showLongPicker, showSessionPicker]);

  const handleSubmit = () => {
    setNewTimerKey(newTimerKey + 1);

    router.push({
      pathname: "/(home)/(index)",
      params: {
        focusDuration,
        shortDuration,
        longDuration,
        sessions,
        newTimerKey: newTimerKey + 1,
      },
    });
  };

  const handlePresetSubmit = (values: SessionPresetType) => {
    setNewTimerKey(newTimerKey + 1);

    router.push({
      pathname: "/(home)/(index)",
      params: {
        focusDuration: values.focus * 60,
        shortDuration: values.short * 60,
        longDuration: values.long * 60,
        sessions: values.sessions,
        newTimerKey: newTimerKey + 1,
      },
    });
  };

  return (
    <GestureHandlerRootView>
      {showFocusPicker && (
        <TimePickerModal
          title={"Focus time"}
          defaultDuration={focusDuration}
          setDuration={setFocusDuration}
          setShowTimePicker={setShowFocusPicker}
        />
      )}
      {showShortPicker && (
        <TimePickerModal
          title={"Short break time"}
          defaultDuration={shortDuration}
          setDuration={setShortDuration}
          setShowTimePicker={setShowShortPicker}
        />
      )}
      {showLongPicker && (
        <TimePickerModal
          title={"Long break time"}
          defaultDuration={longDuration}
          setDuration={setLongDuration}
          setShowTimePicker={setShowLongPicker}
        />
      )}
      {showSessionPicker && (
        <SessionPickerModal
          defaultSessions={sessions}
          setSessions={setSessions}
          setShowSessionPicker={setShowSessionPicker}
        />
      )}
      <SafeAreaWrapper
        style={{
          backgroundColor: background,
        }}
        className="pb-8"
      >
        <Animated.View
          style={{
            transform: [{ scale: containerScale }],
            opacity: containerOpacity,
          }}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-12 px-4"
          >
            <View>
              <H3 className="text-center">Timer</H3>
            </View>
            <View className="gap-4">
              <AnimatedPressable
                onPress={() => setShowFocusPicker(!showFocusPicker)}
                style={{
                  transform: [{ scale: focusPressableScale }],
                  backgroundColor: input,
                  borderColor: border,
                }}
                onPressIn={() => {
                  focusPressableScale.value = withSpring(0.95, buttonSpring);
                }}
                onPressOut={() => {
                  focusPressableScale.value = withSpring(1, buttonSpring);
                }}
                className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
              >
                <Text style={{ color: muted }}>Focus time</Text>
                <Text>{formattedFocus}</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => setShowShortPicker(!showShortPicker)}
                style={{
                  transform: [{ scale: shortPressableScale }],
                  backgroundColor: input,
                  borderColor: border,
                }}
                onPressIn={() => {
                  shortPressableScale.value = withSpring(0.95, buttonSpring);
                }}
                onPressOut={() => {
                  shortPressableScale.value = withSpring(1, buttonSpring);
                }}
                className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
              >
                <Text style={{ color: muted }}>Short break time</Text>
                <Text>{formattedShort}</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => setShowLongPicker(!showLongPicker)}
                style={{
                  transform: [{ scale: longPressableScale }],
                  backgroundColor: input,
                  borderColor: border,
                }}
                onPressIn={() => {
                  longPressableScale.value = withSpring(0.95, buttonSpring);
                }}
                onPressOut={() => {
                  longPressableScale.value = withSpring(1, buttonSpring);
                }}
                className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
              >
                <Text style={{ color: muted }}>Long break time</Text>
                <Text>{formattedLong}</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => setShowSessionPicker(!showSessionPicker)}
                onPressIn={() => {
                  sessionPressableScale.value = withSpring(0.95, buttonSpring);
                }}
                onPressOut={() => {
                  sessionPressableScale.value = withSpring(1, buttonSpring);
                }}
                className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
                style={{
                  transform: [{ scale: sessionPressableScale }],
                  backgroundColor: input,
                  borderColor: border,
                }}
              >
                <Text style={{ color: muted }}>Sessions</Text>
                <Text>{formattedSessions}</Text>
              </AnimatedPressable>
            </View>
            <View className="gap-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Sparkles size={20} color={foreground} />
                <H4>Available session presets</H4>
              </View>
              <View className="gap-4">
                {sessionPresets.map((preset, index) => (
                  <SessionPreset
                    key={index}
                    {...preset}
                    onPress={handlePresetSubmit}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
        <View style={{ backgroundColor: background }} className="px-4 pt-4">
          <Button onPress={handleSubmit}>
            <Text style={{ color: "#ffffff" }}>Start</Text>
          </Button>
        </View>
      </SafeAreaWrapper>
    </GestureHandlerRootView>
  );
};

export default NewTimerScreen;
