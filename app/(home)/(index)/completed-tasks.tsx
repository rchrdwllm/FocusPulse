import Task from "@/components/tasks/task";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { H3 } from "@/components/ui/typography";
import { useCompletedTasks } from "@/hooks/useTasks";
import { View, ScrollView } from "react-native";

const CompletedTasksScreen = () => {
  const { tasks } = useCompletedTasks();

  return (
    <SafeAreaWrapper className="bg-background">
      <ScrollView
        contentContainerClassName="pt-12 px-4 gap-6"
        className="flex-1"
      >
        <H3 className="text-center">Completed Tasks</H3>
        <View className="gap-1">
          {tasks.map((task) => (
            <Task {...task} key={task.id} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CompletedTasksScreen;
