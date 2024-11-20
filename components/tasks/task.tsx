import { useColorScheme, View } from "react-native";
import { H3 } from "../ui/typography";
import { Text } from "../ui/text";
import { CircleCheckBig } from "lucide-react-native";
import { colors } from "@/constants/colors";
const Task = () => {
  const colorScheme = useColorScheme() || "light";
  const { muted } = colors[colorScheme];
  return (
    <View className="bg-secondary p-4 rounded-2xl my-2 flex-row gap-4">
      <CircleCheckBig color={muted} />
      <H3 className="text-lg flex-1">Task title</H3>
      <Text className="text-muted">1/2</Text>
    </View>
  );
};
export default Task;
