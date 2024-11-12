import { Text } from "@/components/ui/text";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { Pressable, View } from "react-native";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { buttonSpring } from "@/constants/spring";
import TimePickerModal from "@/components/modals/time-picker-modal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { formatDuration } from "@/lib/utils";
import SessionPickerModal from "@/components/modals/session-picker-modal";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { timerSchema } from "@/schemas/timer-schema";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NewTimerScreen = () => {
  const form = useForm<z.infer<typeof timerSchema>>({
    resolver: zodResolver(timerSchema),
    defaultValues: {
      task: "",
    },
  });
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

  const handleSubmit = (data: z.infer<typeof timerSchema>) => {
    setNewTimerKey(newTimerKey + 1);

    router.push({
      pathname: "/(home)",
      params: {
        task: data.task,
        focusDuration,
        shortDuration,
        longDuration,
        sessions,
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
      <SafeAreaWrapper className="bg-background px-4 pb-8">
        <Animated.View
          style={{
            transform: [{ scale: containerScale }],
            opacity: containerOpacity,
          }}
          className="flex-1 gap-12"
        >
          <View className="mt-12">
            <H3 className="text-center">Timer settings</H3>
          </View>
          <View className="gap-4">
            <Controller
              control={form.control}
              rules={{
                required: true,
              }}
              name="task"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Task: Write an article"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {form.formState.errors.task && (
              <Text className="text-red-500">
                {form.formState.errors.task.message}
              </Text>
            )}
            <AnimatedPressable
              onPress={() => setShowFocusPicker(!showFocusPicker)}
              style={{
                transform: [{ scale: focusPressableScale }],
              }}
              onPressIn={() => {
                focusPressableScale.value = withSpring(0.95, buttonSpring);
              }}
              onPressOut={() => {
                focusPressableScale.value = withSpring(1, buttonSpring);
              }}
              className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
            >
              <Text className="text-muted">Focus time</Text>
              <Text>{formattedFocus}</Text>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => setShowShortPicker(!showShortPicker)}
              style={{
                transform: [{ scale: shortPressableScale }],
              }}
              onPressIn={() => {
                shortPressableScale.value = withSpring(0.95, buttonSpring);
              }}
              onPressOut={() => {
                shortPressableScale.value = withSpring(1, buttonSpring);
              }}
              className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
            >
              <Text className="text-muted">Short break time</Text>
              <Text>{formattedShort}</Text>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => setShowLongPicker(!showLongPicker)}
              style={{
                transform: [{ scale: longPressableScale }],
              }}
              onPressIn={() => {
                longPressableScale.value = withSpring(0.95, buttonSpring);
              }}
              onPressOut={() => {
                longPressableScale.value = withSpring(1, buttonSpring);
              }}
              className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
            >
              <Text className="text-muted">Long break time</Text>
              <Text>{formattedLong}</Text>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => setShowSessionPicker(!showSessionPicker)}
              style={{
                transform: [{ scale: sessionPressableScale }],
              }}
              onPressIn={() => {
                sessionPressableScale.value = withSpring(0.95, buttonSpring);
              }}
              onPressOut={() => {
                sessionPressableScale.value = withSpring(1, buttonSpring);
              }}
              className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
            >
              <Text className="text-muted">Sessions</Text>
              <Text>{formattedSessions}</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
        <Button onPress={form.handleSubmit(handleSubmit)}>
          <Text>Start</Text>
        </Button>
      </SafeAreaWrapper>
    </GestureHandlerRootView>
  );
};

export default NewTimerScreen;
