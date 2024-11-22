import TaskSessionPickerModal from "@/components/modals/task-session-picker-modal";
import { useTheme } from "@/components/theme/theme-context";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { buttonSpring } from "@/constants/spring";
import { taskSchema } from "@/schemas/task-schema";
import { createTask } from "@/server/task";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as z from "zod";

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
  const [loading, setLoading] = useState(false);
  const {
    currentColors: { primary, background, input, border, muted },
  } = useTheme();

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
    setLoading(true);

    await createTask({
      title: data.task,
      requiredSessions,
    });

    setLoading(false);
  };

  return (
    <GestureHandlerRootView>
      {showSessionPicker && (
        <TaskSessionPickerModal
          defaultSessions={requiredSessions}
          setSessions={setRequiredSessions}
          setShowSessionPicker={setShowSessionPicker}
        />
      )}
      <AlertDialog open={loading}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Creating task</AlertDialogTitle>
          </AlertDialogHeader>
          <ActivityIndicator color={primary} />
        </AlertDialogContent>
      </AlertDialog>
      <SafeAreaWrapper
        className="px-4 pb-8"
        style={{
          backgroundColor: background,
        }}
      >
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
                backgroundColor: input,
                borderColor: border,
              }}
              onPressIn={() => {
                sessionPressableScale.value = withSpring(0.95, buttonSpring);
              }}
              onPressOut={() => {
                sessionPressableScale.value = withSpring(1, buttonSpring);
              }}
              className="web:flex h-10 native:h-12 web:w-full rounded-full border px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0 flex-row items-center justify-between"
            >
              <Text style={{ color: muted }}>Required sessions</Text>
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
          <Text style={{ color: "#ffffff" }}>Add task</Text>
        </Button>
      </SafeAreaWrapper>
    </GestureHandlerRootView>
  );
};
export default NewTaskScreen;
