import { H1 } from "@/components/ui/typography";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useColorScheme, View } from "react-native";
import { colors } from "@/constants/colors";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Task, TimerState } from "@/types";
import Sessions from "./sessions";
import { createSessions } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { incrementTaskSessions } from "@/server/task";
import { useTheme } from "../theme/theme-context";

type CountdownTimerProps = {
  focusDuration: number;
  shortDuration: number;
  longDuration: number;
  newTimerKey: number;
  sessions: number;
  timerState: TimerState;
  setTimerState: (state: TimerState) => void;
  tasks: Task[];
  currentTask: Task;
};

const CountdownTimer = ({
  focusDuration,
  shortDuration,
  longDuration,
  newTimerKey,
  sessions,
  timerState,
  setTimerState,
  currentTask,
}: CountdownTimerProps) => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const { buttonForeground } = colors[colorScheme];
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [sessionsArr, setSessionArr] = useState(() => createSessions(sessions));
  const [sessionCount, setSessionCount] = useState(0);
  const {
    currentColors: { secondary },
  } = useTheme();

  const resetSessions = () => {
    setSessionArr(createSessions(sessions));
    setSessionCount(0);
  };

  useEffect(() => {
    resetSessions();
  }, [sessions]);

  useEffect(() => {
    setTimerKey((prev) => prev + 1);
  }, [focusDuration, shortDuration, longDuration, sessions]);

  useEffect(() => {
    setTimerKey(newTimerKey);
    setIsPlaying(newTimerKey >= 1);
  }, [newTimerKey]);

  useEffect(() => {
    if (sessionCount === sessions) {
      setTimerState("long");
    }
  }, [sessionCount]);

  useEffect(() => {
    const updatedSessions = sessionsArr.map((session) => {
      return session.id + 1 === sessionCount
        ? {
            ...session,
            isCompleted: true,
          }
        : session;
    });

    setSessionArr(updatedSessions);
  }, [sessionCount]);

  const handleComplete = async () => {
    await incrementTaskSessions(currentTask.id);
  };

  return (
    <>
      {timerState === "focus" ? (
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={focusDuration || 1500}
          colors={
            [
              colors[colorScheme].primary,
              colors[colorScheme].primary,
              colors[colorScheme].destructive,
            ] as any
          }
          colorsTime={[focusDuration, 5, 0]}
          trailColor={colors[colorScheme].tertiary as any}
          onComplete={() => {
            handleComplete();
            setSessionCount((prev) => prev + 1);
            setTimerKey((prev) => prev + 1);
            setTimerState(sessionCount + 1 === sessions ? "long" : "short");
          }}
          size={275}
          rotation="counterclockwise"
          key={timerKey}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            return (
              <View
                className="h-[252px] w-[252px] rounded-full justify-center items-center"
                style={{ backgroundColor: secondary }}
              >
                <H1 className="text-foreground text-7xl">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </H1>
              </View>
            );
          }}
        </CountdownCircleTimer>
      ) : timerState === "short" ? (
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={shortDuration || 300}
          colors={
            [
              colors[colorScheme].primary,
              colors[colorScheme].primary,
              colors[colorScheme].destructive,
            ] as any
          }
          colorsTime={[shortDuration, 5, 0]}
          trailColor={colors[colorScheme].tertiary as any}
          onComplete={() => {
            setTimerKey((prev) => prev + 1);
            setTimerState("focus");
          }}
          size={275}
          rotation="counterclockwise"
          key={timerKey}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            return (
              <View className="bg-secondary h-[252px] w-[252px] rounded-full justify-center items-center">
                <H1 className="text-foreground text-7xl">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </H1>
              </View>
            );
          }}
        </CountdownCircleTimer>
      ) : (
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={longDuration || 900}
          colors={
            [
              colors[colorScheme].primary,
              colors[colorScheme].primary,
              colors[colorScheme].destructive,
            ] as any
          }
          colorsTime={[longDuration, 5, 0]}
          trailColor={colors[colorScheme].tertiary as any}
          onComplete={() => {
            setTimerKey((prev) => prev + 1);
            setTimerState("focus");
            resetSessions();
          }}
          size={275}
          rotation="counterclockwise"
          key={timerKey}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            return (
              <View className="bg-secondary h-[252px] w-[252px] rounded-full justify-center items-center">
                <H1 className="text-foreground text-7xl">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </H1>
              </View>
            );
          }}
        </CountdownCircleTimer>
      )}
      <Sessions sessions={sessionsArr} />
      <Button
        size="icon"
        className="rounded-full h-20 w-20 items-center justify-center"
        onPress={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <Pause color={buttonForeground} />
        ) : (
          <Play color={buttonForeground} />
        )}
      </Button>
    </>
  );
};

export default CountdownTimer;
