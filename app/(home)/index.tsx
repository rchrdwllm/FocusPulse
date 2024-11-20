import CountdownTimer from "@/components/countdown-timer/countdown-timer";
import Task from "@/components/tasks/task";
import { Input } from "@/components/ui/input";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { Text } from "@/components/ui/text";
import { H1, H3 } from "@/components/ui/typography";
import { useTasks } from "@/hooks/useTasks";
import { TimerState } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

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
  const { tasks } = useTasks();

  useEffect(() => {
    setCurrentTask(task as string);
  }, [task]);

  return (
    <SafeAreaWrapper className="bg-background px-4">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-12 justify-center items-center"
      >
        <View className="w-full items-center px-12 gap-12 mt-12">
          <H1 className="text-center text-3xl">
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
        <View className="w-full">
          <H3 className="text-center">Tasks</H3>
          <Text className="text-center text-muted">
            You can view your tasks here
          </Text>
          <View className="gap-1 mt-4">
            {tasks.map((task) => (
              <Task key={task.id} {...task} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
