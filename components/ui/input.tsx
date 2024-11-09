import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { TextInput, useColorScheme } from "react-native";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

const Input = forwardRef<
  ElementRef<typeof TextInput>,
  ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
  const colorScheme = useColorScheme() || "light";
  const { muted } = colors[colorScheme];

  return (
    <TextInput
      ref={ref}
      className={cn(
        "web:flex h-10 native:h-12 web:w-full rounded-full border border-border bg-input px-4 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring web:focus-visible:ring-offset-0",
        props.editable === false && "opacity-50 web:cursor-not-allowed",
        className
      )}
      placeholderTextColor={muted}
      placeholderClassName={cn("text-muted", placeholderClassName)}
      style={{ fontFamily: "InriaSansRegular" }}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
