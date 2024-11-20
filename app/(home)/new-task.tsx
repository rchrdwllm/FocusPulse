import { Pressable, View } from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { Controller, useForm } from "react-hook-form";
import { taskSchema } from "@/schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { buttonSpring } from "@/constants/spring";
import { Button } from "@/components/ui/button";
import SessionPickerModal from "@/components/modals/session-picker-modal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { v4 } from "uuid";
import { Timestamp } from "firebase/firestore";
import { createTask } from "@/server/task";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NewTaskScreen = () => {
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [requiredSessions, setRequiredSessions] = useState(1);
  const containerScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);
  const sessionPressableScale = useSharedValue(1);
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      task: "",
    },
  });

  useEffect(() => {
    if (showSessionPicker) {
      containerScale.value = withTiming(0.8);
      containerOpacity.value = withTiming(0.3);
    } else {
      containerScale.value = withTiming(1);
      containerOpacity.value = withTiming(1);
    }
  }, [showSessionPicker]);

  const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
    const { success, error } = await createTask({
      title: data.task,
      requiredSessions,
    });

    console.log({
      success,
      error,
    });
  };

  return (
    <GestureHandlerRootView>
      {showSessionPicker && (
        <SessionPickerModal
          defaultSessions={requiredSessions}
          setSessions={setRequiredSessions}
          setShowSessionPicker={setShowSessionPicker}
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
            <H3 className="text-center">New task</H3>
          </View>
          <View className="gap-4">
            <Controller
              control={form.control}
              rules={{
                required: true,
              }}
              name="task"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Task: Write an article"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            <AnimatedPressable
              onPress={() => setShowSessionPicker(!showSessionPicker)}
              style={{
                transform: [{ scale: sessionPressableScale }],
              }}
              onPressIn={() => {
                sessionPressableScale.value = withSpring(0.95, buttonSpring);
              }}
              onPressOut={() => {
                sessionPressableScale.value = withSpring(1, buttonSpring);
              }}
              className="web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
            >
              <Text className="text-muted">Required sessions</Text>
              <Text>{requiredSessions}</Text>
            </AnimatedPressable>
          </View>
          {form.formState.errors.task && (
            <Text className="text-red-500">
              {form.formState.errors.task.message}
            </Text>
          )}
        </Animated.View>
        <Button onPress={form.handleSubmit(handleSubmit)}>
          <Text>Add task</Text>
        </Button>
      </SafeAreaWrapper>
    </GestureHandlerRootView>
  );
};
export default NewTaskScreen;
