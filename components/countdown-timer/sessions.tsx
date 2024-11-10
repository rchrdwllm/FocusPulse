import { View } from "react-native";
import { Session as SessionType } from "@/types";
import Session from "./session";

type Sessions = {
  sessions: SessionType[];
};

const Sessions = ({ sessions }: Sessions) => {
  return (
    <View className="flex-row flex-wrap items-center justify-center px-8 gap-8">
      {sessions.map((session) => (
        <Session key={session.id} {...session} />
      ))}
    </View>
  );
};

export default Sessions;
