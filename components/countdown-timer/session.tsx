import { colors } from "@/constants/colors";
import { Session as SessionType } from "@/types";
import { useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/theme-context";

const Session = ({ isCompleted }: SessionType) => {
  const {
    currentColors: { tertiary, primary },
  } = useTheme();
  const bgColor = useSharedValue(tertiary);

  useEffect(() => {
    if (isCompleted) {
      bgColor.value = withTiming(primary);
    } else {
      bgColor.value = withTiming(tertiary);
    }
  }, [isCompleted, tertiary, primary]);

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
