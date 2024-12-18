import { forwardRef, createContext, useContext } from "react";
import * as Slot from "@rn-primitives/slot";
import { SlottableTextProps, TextRef } from "@rn-primitives/types";
import { Text as RNText } from "react-native";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme/theme-context";

const TextClassContext = createContext<string | undefined>(undefined);

const Text = forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, style, ...props }, ref) => {
    const textClass = useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    const {
      currentColors: { foreground },
    } = useTheme();

    return (
      <Component
        className={cn(
          "text-lg text-foreground web:select-text",
          textClass,
          className
        )}
        ref={ref}
        style={{
          fontFamily: "Inter_400Regular",
          color: foreground,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, TextClassContext };
