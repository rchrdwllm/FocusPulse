import React, { useEffect, useState } from "react";

import { View } from "react-native";
import { Text } from "../ui/text";
import { H1 } from "../ui/typography";
import { useTheme } from "../theme/theme-context";
import { Col, Row, Grid } from "react-native-easy-grid";
import { useAnalytics } from "@/hooks/useAnalytics";

const Analytics = () => {
  const {
    currentColors: { muted, border, input },
  } = useTheme();
  const { analytics, loading } = useAnalytics();
  const [formattedAnalytics, setFormattedAnalytics] = useState({
    focusMinutes: 0,
    shortBreakMinutes: 0,
    longBreakMinutes: 0,
    pomodoroSessions: 0,
  });

  useEffect(() => {
    if (analytics) {
      setFormattedAnalytics({
        focusMinutes: Math.floor(analytics.focus / 60),
        shortBreakMinutes: Math.floor(analytics.short / 60),
        longBreakMinutes: Math.floor(analytics.long / 60),
        pomodoroSessions: analytics.sessions,
      });
    }
  }, [analytics]);

  if (loading) return null;

  if (!analytics) return null;

  return (
    <Grid
      className="border rounded-3xl"
      style={{ borderColor: border, backgroundColor: input }}
    >
      <Col>
        <View className="gap-4 py-4">
          <Text className="text-center text-base" style={{ color: muted }}>
            Focus minutes
          </Text>
          <H1 className="text-5xl text-center">
            {formattedAnalytics.focusMinutes}
          </H1>
        </View>
        <View className="gap-4 py-4">
          <Text className="text-center text-base" style={{ color: muted }}>
            Short break minutes
          </Text>
          <H1 className="text-5xl text-center">
            {formattedAnalytics.shortBreakMinutes}
          </H1>
        </View>
      </Col>
      <Col>
        <View className="gap-4 py-4">
          <Text className="text-center text-base" style={{ color: muted }}>
            Long break minutes
          </Text>
          <H1 className="text-5xl text-center">
            {formattedAnalytics.longBreakMinutes}
          </H1>
        </View>
        <View className="gap-4 py-4">
          <Text className="text-center text-base" style={{ color: muted }}>
            Pomodoro sessions
          </Text>
          <H1 className="text-5xl text-center">
            {formattedAnalytics.pomodoroSessions}
          </H1>
        </View>
      </Col>
    </Grid>
  );
};

export default Analytics;
