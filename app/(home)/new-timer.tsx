import { Text } from "@/components/ui/text";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { View } from "react-native";
import { Input } from "@/components/ui/input";

const NewTimerScreen = () => {
  return (
    <SafeAreaWrapper className="bg-background px-4 gap-12">
      <View className="mt-12">
        <H3 className="text-center">New timer</H3>
      </View>
      <View className="gap-4">
        <Input placeholder="Task: Write an article" />
        <Input placeholder="Focus time" />
      </View>
    </SafeAreaWrapper>
  );
};

export default NewTimerScreen;
