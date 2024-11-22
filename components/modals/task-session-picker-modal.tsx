import React from "react";
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
import { useTheme } from "../theme/theme-context";

type TaskSessionPickerModalProps = {
  setShowSessionPicker: (show: boolean) => void;
  setSessions: (sessions: number) => void;
  defaultSessions: number;
};

const TaskSessionPickerModal = ({
  setShowSessionPicker,
  setSessions,
  defaultSessions,
}: TaskSessionPickerModalProps) => {
  const modalOffset = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);
  const { height } = useWindowDimensions();
  const sessionPickerRef = useRef<TimerPickerRef>(null);
  const [newSessions, setNewSessions] = useState(defaultSessions);
  const {
    currentColors: { background, foreground, muted, input, border },
  } = useTheme();

  const toggleModal = () => {
    setShowSessionPicker(false);

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
    setSessions(newSessions);

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
            backgroundColor: background,
          }}
          className="flex-1 absolute h-full w-full z-20"
        >
          <SafeAreaWrapper>
            <H3 className="text-center pt-12">Sessions</H3>
            <View className="flex-1 justify-center items-center gap-4">
              <TimerPicker
                ref={sessionPickerRef}
                padWithNItems={3}
                initialValue={{ seconds: defaultSessions }}
                hideHours
                hideMinutes
                secondLabel="sessions"
                secondLimit={{
                  min: 1,
                  max: 8,
                }}
                FlatList={FlatList as any}
                LinearGradient={LinearGradient}
                styles={{
                  theme: "light",
                  backgroundColor: background,
                  pickerItem: {
                    fontSize: 34,
                    fontFamily: "Inter_500Medium",
                    color: foreground,
                  },
                  pickerLabel: {
                    fontSize: 26,
                    right: -20,
                    fontFamily: "Inter_400Regular",
                    color: muted,
                  },
                  pickerLabelContainer: {
                    right: -5,
                  },
                  pickerItemContainer: {
                    width: 150,
                    right: 50,
                  },
                }}
                onDurationChange={(sessions) => {
                  setNewSessions(sessions.seconds);
                }}
              />
              <View className="flex-row gap-4 px-12">
                <Button
                  onPress={toggleModal}
                  className="flex-1 border"
                  style={{
                    backgroundColor: input,
                    borderColor: border,
                  }}
                >
                  <Text
                    style={{
                      color: foreground,
                    }}
                  >
                    Cancel
                  </Text>
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

export default TaskSessionPickerModal;
