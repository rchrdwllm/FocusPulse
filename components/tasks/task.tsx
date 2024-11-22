import { Pressable, useColorScheme, View } from "react-native";
import { H3 } from "../ui/typography";
import { Text } from "../ui/text";
import { CircleCheckBig } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Task as TaskType } from "@/types";
import { cn } from "@/lib/utils";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { completeTask } from "@/server/task";
import { useTheme } from "../theme/theme-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Task = ({
  title,
  sessionsCompleted,
  requiredSessions,
  isCompleted,
  id,
}: TaskType) => {
  const scaleRef = useSharedValue(1);
  const {
    currentColors: { muted, primary, secondary, foreground },
  } = useTheme();

  const handlePress = () => {
    completeTask(id);
  };

  return (
    <View
      className="p-4 rounded-2xl my-2 flex-row gap-4"
      style={{
        backgroundColor: secondary,
      }}
    >
      <AnimatedPressable
        onPressIn={() => {
          scaleRef.value = withSpring(0.9);
        }}
        onPressOut={() => {
          scaleRef.value = withSpring(1);
        }}
        onPress={handlePress}
        style={{
          transform: [{ scale: scaleRef }],
        }}
      >
        <CircleCheckBig color={isCompleted ? primary : muted} />
      </AnimatedPressable>
      <H3
        className={cn("text-lg flex-1", isCompleted ? "line-through" : "")}
        style={{ color: isCompleted ? muted : foreground }}
      >
        {title}
      </H3>
      <Text style={{ color: muted }}>
        {sessionsCompleted}/{requiredSessions}
      </Text>
    </View>
  );
};

export default Task;
