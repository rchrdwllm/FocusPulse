import { H1 } from "@/components/ui/typography";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-native-countdown-circle-timer";
import { useColorScheme, View } from "react-native";
import { colors } from "@/constants/colors";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react-native";
import { useEffect, useState } from "react";

type CountdownTimerProps = {
  duration: number;
};

const CountdownTimer = ({ duration }: CountdownTimerProps) => {
  const colorScheme = useColorScheme() as "light" | "dark";
  const { buttonForeground } = colors[colorScheme];
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    setTimerKey((prev) => prev + 1);
  }, [duration]);

  return (
    <>
      <CountdownCircleTimer
        isPlaying={isPlaying}
        duration={duration || 0}
        colors={
          [
            colors[colorScheme].primary,
            colors[colorScheme].primary,
            colors[colorScheme].destructive,
          ] as any
        }
        colorsTime={[duration, 5, 0]}
        trailColor={colors[colorScheme].tertiary as any}
        onComplete={() => {
          return { shouldRepeat: true };
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
