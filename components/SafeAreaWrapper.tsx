import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

const SafeAreaWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }} className={cn("flex-1", className)}>
      {children}
    </View>
  );
};

export default SafeAreaWrapper;
