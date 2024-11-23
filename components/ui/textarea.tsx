import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme/theme-context";

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps
>(
  (
    {
      className,
      multiline = true,
      numberOfLines = 4,
      placeholderClassName,
      ...props
    },
    ref
  ) => {
    const {
      currentColors: { foreground, muted, background, border, input },
    } = useTheme();

    return (
      <TextInput
        ref={ref}
        className={cn(
          "web:flex min-h-[80px] w-full rounded-3xl border border-border bg-input px-4 py-3 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        style={{
          fontFamily: "Inter_400Regular",
          backgroundColor: input,
          borderColor: border,
          color: foreground,
        }}
        placeholderTextColor={muted}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
