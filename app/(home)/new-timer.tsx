import { Text } from "@/components/ui/text";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { Pressable, View } from "react-native";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { buttonSpring } from "@/constants/spring";
import TimePickerModal from "@/components/modals/time-picker-modal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NewTimerScreen = () => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const pressableScale = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);
  const [duration, setDuration] = useState(0);
  const [formattedDuration, setFormattedDuration] = useState("25 mins 0 secs");

  const handlePress = () => {
    setShowTimePicker(!showTimePicker);
  };

  const handlePressIn = () => {
    pressableScale.value = withSpring(0.98, buttonSpring);
  };

  const handlePressOut = () => {
    pressableScale.value = withSpring(1, buttonSpring);
  };

  const formatDuration = () => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    setFormattedDuration(
      `${minutes} ${minutes === 1 ? "min" : "mins"} ${seconds} ${
        seconds === 1 ? "sec" : "secs"
      }`
    );
  };

  useEffect(() => {
    formatDuration();
  }, [duration]);

  useEffect(() => {
    if (showTimePicker) {
      containerScale.value = withTiming(0.8);
      containerOpacity.value = withTiming(0.3);
    } else {
      containerScale.value = withTiming(1);
      containerOpacity.value = withTiming(1);
    }
  }, [showTimePicker]);

  const handleSubmit = () => {
    router.push({
      pathname: "/(home)",
      params: {
        duration,
      },
    });
  };

  return (
    <GestureHandlerRootView>
      {showTimePicker && (
        <TimePickerModal
          setDuration={setDuration}
          setShowTimePicker={setShowTimePicker}
        />
      )}
      <SafeAreaWrapper className="bg-background px-4 pb-8">
        <Animated.View
          style={{
            transform: [{ scale: containerScale }],
            opacity: containerOpacity,
          }}
          className="flex-1 gap-12"
        >
          <View className="mt-12">
            <H3 className="text-center">New timer</H3>
          </View>
          <View className="gap-4">
            <Input placeholder="Task: Write an article" />
            <AnimatedPressable
              onPress={handlePress}
              style={{
                transform: [{ scale: pressableScale }],
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
            >
              <Text className="text-muted">Focus time</Text>
              <Text>{formattedDuration}</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
        <Button onPress={handleSubmit}>
          <Text>Start</Text>
        </Button>
      </SafeAreaWrapper>
    </GestureHandlerRootView>
  );
};

export default NewTimerScreen;
