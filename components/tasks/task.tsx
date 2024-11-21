import { Pressable, useColorScheme, View } from "react-native";
import { H3 } from "../ui/typography";
import { Text } from "../ui/text";
import { CircleCheckBig } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Task as TaskType } from "@/types";
import { cn } from "@/lib/utils";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { completeTask } from "@/server/task";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Task = ({
  title,
  sessionsCompleted,
  requiredSessions,
  isCompleted,
  id,
}: TaskType) => {
  const scaleRef = useSharedValue(1);
  const colorScheme = useColorScheme() || "light";
  const { muted, primary } = colors[colorScheme];

  const handlePress = () => {
    completeTask(id);
  };

  return (
    <View className="bg-secondary p-4 rounded-2xl my-2 flex-row gap-4">
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
        className={cn(
          "text-lg flex-1",
          isCompleted ? "text-muted line-through" : "text-foreground"
        )}
      >
        {title}
      </H3>
      <Text className="text-muted">
        {sessionsCompleted}/{requiredSessions}
      </Text>
    </View>
  );
};

export default Task;
