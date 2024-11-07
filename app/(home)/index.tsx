import { H1 } from "@/components/Typography";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { View } from "react-native";
import { colors } from "@/constants/colors";

const HomeScreen = () => {
  return (
    <SafeAreaWrapper className="bg-background px-4">
      <View className="flex-1 justify-center items-center">
        <CountdownCircleTimer
          isPlaying
          duration={1250}
          colors={[colors.dark.primary] as any}
          trailColor={colors.dark.secondary as any}
          size={275}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            return (
              <View className="bg-[#262138] h-[252px] w-[252px] rounded-full justify-center items-center">
                <H1 className="text-white text-7xl">
                  {minutes}:{seconds}
                </H1>
              </View>
            );
          }}
        </CountdownCircleTimer>
      </View>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
