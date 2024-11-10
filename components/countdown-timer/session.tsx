import { colors } from "@/constants/colors";
import { Session as SessionType } from "@/types";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const Session = ({ isCompleted }: SessionType) => {
  const colorScheme = useColorScheme() || "light";
  const { tertiary, primary } = colors[colorScheme];
  const bgColor = useSharedValue(tertiary);

  useEffect(() => {
    if (isCompleted) {
      bgColor.value = withTiming(primary);
    } else {
      bgColor.value = withTiming(tertiary);
    }
  }, [isCompleted]);

  return (
    <Animated.View
      className="h-8 w-8 rounded-full"
      style={{
        backgroundColor: bgColor,
      }}
    ></Animated.View>
  );
};

export default Session;
