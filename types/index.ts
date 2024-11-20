import { Timestamp } from "firebase/firestore";

export type TimerState = "focus" | "short" | "long";

export type Session = {
  id: number;
  isCompleted: boolean;
};

export type Task = {
  id: string;
  title: string;
  sessionsCompleted: number;
  requiredSessions: number;
  isCompleted: boolean;
  createdAt: Timestamp;
  userId: string;
};
