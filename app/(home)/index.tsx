import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import CountdownTimer from "@/components/countdown-timer/countdown-timer";
import { Input } from "@/components/ui/input";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import Sessions from "@/components/countdown-timer/sessions";
import { useEffect, useState } from "react";
import { TimerState } from "@/types";
import { H1 } from "@/components/ui/typography";

const HomeScreen = () => {
  const {
    focusDuration,
    shortDuration,
    longDuration,
    newTimerKey,
    sessions,
    task,
  } = useLocalSearchParams();
  const [timerState, setTimerState] = useState<TimerState>("focus");
  const [currentTask, setCurrentTask] = useState("");

  useEffect(() => {
    setCurrentTask(task as string);
  }, [task]);

  return (
    <SafeAreaWrapper className="bg-background px-4">
      <View className="flex-1 justify-center items-center gap-12">
        <View className="w-full items-center px-12 gap-12">
          <H1>
            {timerState === "focus"
              ? "Focus!"
              : timerState === "short"
              ? "Take a short break"
              : "Enjoy a long break"}
          </H1>
          <Input
            value={currentTask}
            onChange={(e) => setCurrentTask(e.nativeEvent.text)}
            className="w-full"
          />
        </View>
        <CountdownTimer
          newTimerKey={parseInt(newTimerKey as string)}
          focusDuration={parseInt(focusDuration as string)}
          shortDuration={parseInt(shortDuration as string)}
          longDuration={parseInt(longDuration as string)}
          sessions={parseInt(sessions as string)}
          timerState={timerState}
          setTimerState={setTimerState}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
