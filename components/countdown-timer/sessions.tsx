import { useMemo } from "react";
import { View } from "react-native";
import Session from "./session";

type Sessions = {
  sessions: number;
};

const Sessions = ({ sessions }: Sessions) => {
  const sessionArray = useMemo(() => {
    return Array.from({ length: !sessions ? 4 : sessions }, (_, i) => i);
  }, [sessions]);

  return (
    <View className="flex-row flex-wrap items-center justify-center px-8 gap-8">
      {sessionArray.map((session) => (
        <Session key={session} />
      ))}
    </View>
  );
};

export default Sessions;
