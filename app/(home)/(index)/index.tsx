import React from "react";

import CountdownTimer from "@/components/countdown-timer/countdown-timer";
import Task from "@/components/tasks/task";
import { useTheme } from "@/components/theme/theme-context";
import { Input } from "@/components/ui/input";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { Text } from "@/components/ui/text";
import { H1, H3 } from "@/components/ui/typography";
import { useTasks } from "@/hooks/useTasks";
import { TimerState } from "@/types";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { initUserSettings } from "@/server/settings";
import { initAnalytics } from "@/server/analytics";

const HomeScreen = () => {
  const { focusDuration, shortDuration, longDuration, newTimerKey, sessions } =
    useLocalSearchParams();
  const [timerState, setTimerState] = useState<TimerState>("focus");
  const { tasks } = useTasks();
  const [currentTask, setCurrentTask] = useState(tasks[0]);
  const {
    currentColors: { background, muted },
  } = useTheme();

  useEffect(() => {
    initUserSettings();
    initAnalytics();
  }, []);

  useEffect(() => {
    setCurrentTask(tasks[0]);
  }, [tasks]);

  return (
    <SafeAreaWrapper
      style={{
        backgroundColor: background,
      }}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 gap-12 justify-center items-center"
      >
        <View className="w-full items-center px-12 gap-12 mt-8">
          <H1 className="text-center text-3xl">
            {timerState === "focus"
              ? "Focus!"
              : timerState === "short"
                ? "Take a short break"
                : "Enjoy a long break"}
          </H1>
          <Input
            value={
              currentTask
                ? `Task: ${currentTask?.title}`
                : "Not working on any task"
            }
            className="w-full pointer-events-none text-center"
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
          tasks={tasks}
          currentTask={currentTask}
        />
        <View className="w-full pb-8">
          <H3 className="text-center">Tasks</H3>
          <Text className="text-center" style={{ color: muted }}>
            You can view your tasks here
          </Text>
          <View className="gap-1 mt-4">
            {tasks.map((task) => (
              <Task key={task.id} {...task} />
            ))}
          </View>
          <View className="items-center mt-8">
            <Link href="/completed-tasks">
              <Text className="text-center" style={{ color: muted }}>
                See completed tasks
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
