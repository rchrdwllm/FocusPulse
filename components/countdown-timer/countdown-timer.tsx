import React from "react";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { colors } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";
import { createSessions } from "@/lib/utils";
import { incrementTaskSessions } from "@/server/task";
import { Task, TimerState } from "@/types";
import { Pause, Play } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useTheme } from "../theme/theme-context";
import Sessions from "./sessions";
import { useDebounce } from "@uidotdev/usehooks";
import { updateAnalytics } from "@/server/analytics";
import { updateStreak } from "@/server/streak";

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
  const { settings } = useSettings();
  const [focusSpent, setFocusSpent] = useState(0);
  const debouncedFocus = useDebounce(focusSpent, 5000);
  const [shortSpent, setShortSpent] = useState(0);
  const debouncedShort = useDebounce(shortSpent, 5000);
  const [longSpent, setLongSpent] = useState(0);
  const debouncedLong = useDebounce(longSpent, 5000);
  const [sessionsSpent, setSessionsSpent] = useState(0);

  useEffect(() => {
    setTimerState("focus");
  }, [sessions]);

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
    if (debouncedFocus) {
      updateAnalytics({ focus: debouncedFocus });

      setFocusSpent(0);
    }
  }, [debouncedFocus]);

  useEffect(() => {
    if (debouncedShort) {
      updateAnalytics({ short: debouncedShort });

      setShortSpent(0);
    }
  }, [debouncedShort]);

  useEffect(() => {
    if (debouncedLong) {
      updateAnalytics({ long: debouncedLong });

      setLongSpent(0);
    }
  }, [debouncedLong]);

  useEffect(() => {
    if (sessionsSpent) {
      updateAnalytics({ sessions: sessionsSpent });

      setSessionsSpent(0);
    }
  }, [sessionsSpent]);

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

  useEffect(() => {
    if (timerState === "short" || timerState === "long") {
      if (settings) {
        setIsPlaying(settings.autoStartBreaks);
      }
    }

    if (timerState === "focus") {
      if (settings) {
        setIsPlaying(settings.autoStartPomodoro);
      }
    }
  }, [
    timerState,
    settings,
    focusDuration,
    shortDuration,
    longDuration,
    sessions,
  ]);

  useEffect(() => {
    setIsPlaying(false);
  }, [settings]);

  const handleComplete = async () => {
    if (currentTask) {
      await incrementTaskSessions(currentTask.id);
    }

    await updateStreak();
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
            setSessionsSpent(sessionsSpent + 1);
            setTimerKey((prev) => prev + 1);
            setTimerState(sessionCount + 1 === sessions ? "long" : "short");
          }}
          onUpdate={() => {
            setFocusSpent(focusSpent + 1);
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
          onUpdate={() => {
            setShortSpent(shortSpent + 1);
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
          onUpdate={() => {
            setLongSpent(longSpent + 1);
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
