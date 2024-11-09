import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
import { useWindowDimensions } from "react-native";
import { useEffect } from "react";

const TimePickerModal = ({
  setShowTimePicker,
}: {
  setShowTimePicker: (show: boolean) => void;
}) => {
  const modalOffset = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);
  const { height } = useWindowDimensions();

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
            <H3 className="text-center pt-12">Focus time</H3>
          </SafeAreaWrapper>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default TimePickerModal;
