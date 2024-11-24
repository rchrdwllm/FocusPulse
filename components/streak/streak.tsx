import { useStreak } from "@/hooks/useStreak";
import React from "react";
import { Image, View } from "react-native";
import { useTheme } from "../theme/theme-context";
import { H4 } from "../ui/typography";
import { Text } from "../ui/text";

const streakImg = require("@/assets/images/streak.png");
const streakGreyImg = require("@/assets/images/streak-grey.png");

const Streak = () => {
  const { streak } = useStreak();
  const {
    currentColors: { primary, input, border, muted },
  } = useTheme();

  if (!streak)
    return (
      <View
        className="items-center justify-center gap-4 border rounded-3xl px-4 py-8"
        style={{
          backgroundColor: input,
          borderColor: border,
        }}
      >
        <Image
          source={streakGreyImg}
          className="w-[75px] h-[75px]"
          style={{
            objectFit: "contain",
          }}
        />
        <View>
          <H4 style={{ color: "white" }} className="text-center">
            No streak yet
          </H4>
          <Text style={{ color: muted }} className="text-center text-base">
            Complete at least 1 session per day to start a streak
          </Text>
        </View>
      </View>
    );

  if (streak.streakCount === 0)
    return (
      <View
        className="items-center justify-center gap-4 border rounded-3xl px-4 py-8"
        style={{
          backgroundColor: input,
          borderColor: border,
        }}
      >
        <Image
          source={streakGreyImg}
          className="w-[75px] h-[75px]"
          style={{
            objectFit: "contain",
          }}
        />
        <View>
          <H4 style={{ color: "white" }} className="text-center">
            No streak yet
          </H4>
          <Text style={{ color: muted }} className="text-center text-base">
            Complete at least 1 session per day to start a streak
          </Text>
        </View>
      </View>
    );

  return (
    <View
      className="items-center justify-center gap-4 border rounded-3xl px-4 py-8"
      style={{
        backgroundColor: primary,
        borderColor: primary,
      }}
    >
      <Image
        source={streakImg}
        className="w-[75px] h-[75px]"
        style={{
          objectFit: "contain",
        }}
      />
      <View>
        <H4 style={{ color: "white" }} className="text-center">
          Keep your streak going!
        </H4>
        <Text
          style={{ color: "white" }}
          className="text-center text-base opacity-70"
        >
          {streak.streakCount} days and counting
        </Text>
      </View>
    </View>
  );
};

export default Streak;
