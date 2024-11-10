import {
  Gesture,
  GestureDetector,
  FlatList,
} from "react-native-gesture-handler";
import SafeAreaWrapper from "../ui/safe-area-wrapper";
import { H3 } from "../ui/typography";
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColorScheme, useWindowDimensions, View } from "react-native";
import { TimerPicker, TimerPickerRef } from "react-native-timer-picker";
import { colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

type TimePickerModalProps = {
  setShowTimePicker: (show: boolean) => void;
  setDuration: (duration: number) => void;
  title: string;
};

const TimePickerModal = ({
  setShowTimePicker,
  setDuration,
  title,
}: TimePickerModalProps) => {
  const modalOffset = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);
  const { height } = useWindowDimensions();
  const colorScheme = useColorScheme() || "light";
  const { background, foreground, muted } = colors[colorScheme];
  const timePickerRef = useRef<TimerPickerRef>(null);
  const [newDuration, setNewDuration] = useState(1500);

  const toggleModal = () => {
    setShowTimePicker(false);

    modalOffset.value = 0;
    overlayOpacity.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((e) => {
      modalOffset.value += e.changeY;
      overlayOpacity.value = 1 - modalOffset.value / height;
    })
    .onFinalize(() => {
      if (modalOffset.value < height / 3) {
        modalOffset.value = withSpring(0, {
          mass: 1,
          damping: 20,
          stiffness: 175,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
      } else {
        runOnJS(toggleModal)();

        modalOffset.value = withSpring(height);
        overlayOpacity.value = withSpring(1);
      }
    });

  const handleSubmit = () => {
    setDuration(newDuration);

    toggleModal();
  };

  return (
    <>
      <Animated.View
        className="flex-1 absolute h-full w-full z-10"
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Animated.View
          style={{
            opacity: overlayOpacity,
          }}
          className="flex-1 bg-black/40 z-10"
        />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          entering={SlideInDown.springify()
            .damping(20)
            .mass(1)
            .stiffness(175)
            .restDisplacementThreshold(0.01)
            .restSpeedThreshold(2)
            .overshootClamping(0)}
          exiting={SlideOutDown}
          style={{
            transform: [{ translateY: modalOffset }],
          }}
          className="flex-1 absolute h-full w-full bg-background z-20"
        >
          <SafeAreaWrapper>
            <H3 className="text-center pt-12">{title}</H3>
            <View className="flex-1 justify-center items-center gap-4">
              <TimerPicker
                ref={timePickerRef}
                padWithNItems={3}
                hideHours
                minuteLabel="min"
                secondLabel="sec"
                FlatList={FlatList as any}
                LinearGradient={LinearGradient}
                styles={{
                  theme: "light",
                  backgroundColor: background,
                  pickerItem: {
                    fontSize: 34,
                    fontFamily: "InriaSansRegular",
                    color: foreground,
                  },
                  pickerLabel: {
                    fontSize: 26,
                    right: -20,
                    fontFamily: "InriaSansRegular",
                    color: muted,
                  },
                  pickerLabelContainer: {
                    width: 60,
                  },
                  pickerItemContainer: {
                    width: 150,
                  },
                }}
                onDurationChange={(duration) => {
                  const minutes = duration.minutes;
                  const seconds = duration.seconds;

                  setNewDuration(minutes * 60 + seconds);
                }}
              />
              <View className="flex-row gap-4 px-12">
                <Button
                  onPress={toggleModal}
                  className="flex-1 bg-input border border-border"
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
                <Button className="flex-1" onPress={handleSubmit}>
                  <Text>Set</Text>
                </Button>
              </View>
            </View>
          </SafeAreaWrapper>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default TimePickerModal;
