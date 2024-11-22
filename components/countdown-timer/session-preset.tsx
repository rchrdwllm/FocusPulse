import { SessionPreset as SessionPresetType } from "@/types";
import React from "react";
import { Pressable } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme } from "../theme/theme-context";
import { Text } from "../ui/text";
import { buttonSpring } from "@/constants/spring";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SessionPresetProps = SessionPresetType & {
  onPress: (e: any) => void;
};

const SessionPreset = ({
  focus,
  short,
  long,
  sessions,
  onPress,
}: SessionPresetProps) => {
  const {
    currentColors: { input, border },
  } = useTheme();
  const scale = useSharedValue(1);

  const handleSubmit = () => {
    onPress({ focus, short, long, sessions });
  };

  return (
    <AnimatedPressable
      className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
      style={{
        transform: [{ scale }],
        backgroundColor: input,
        borderColor: border,
      }}
      onPressIn={() => {
        scale.value = withSpring(0.95, buttonSpring);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, buttonSpring);
      }}
      onPress={handleSubmit}
    >
      <Text>
        {focus} : {short} : {long}, {sessions} sessions
      </Text>
    </AnimatedPressable>
  );
};

export default SessionPreset;
