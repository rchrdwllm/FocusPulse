import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

const SafeAreaWrapper = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: {};
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: top, ...style }}
      className={cn("flex-1", className)}
    >
      {children}
    </View>
  );
};

export default SafeAreaWrapper;
