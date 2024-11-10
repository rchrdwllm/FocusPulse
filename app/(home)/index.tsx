import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import CountdownTimer from "@/components/countdown-timer/countdown-timer";
import { Input } from "@/components/ui/input";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import Sessions from "@/components/countdown-timer/sessions";

const HomeScreen = () => {
  const { focusDuration, shortDuration, longDuration, newTimerKey, sessions } =
    useLocalSearchParams();

  return (
    <SafeAreaWrapper className="bg-background px-4">
      <View className="flex-1 justify-center items-center gap-12">
        <View className="w-full items-center px-12 gap-4">
          <Text className="text-muted text-xl">Current task</Text>
          <Input value="Insert task here" className="w-full" />
        </View>
        <CountdownTimer
          newTimerKey={parseInt(newTimerKey as string)}
          focusDuration={parseInt(focusDuration as string)}
          shortDuration={parseInt(shortDuration as string)}
          longDuration={parseInt(longDuration as string)}
        />
        <Sessions sessions={parseInt(sessions as string)} />
      </View>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
