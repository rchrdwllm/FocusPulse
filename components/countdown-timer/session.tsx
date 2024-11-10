import { colors } from "@/constants/colors";
import { useColorScheme, View } from "react-native";

const Session = () => {
  const colorScheme = useColorScheme() || "light";
  const { tertiary } = colors[colorScheme];

  return (
    <View
      className="h-8 w-8 rounded-full"
      style={{
        backgroundColor: tertiary,
      }}
    ></View>
  );
};

export default Session;
