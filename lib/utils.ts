import { Session } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes} ${minutes === 1 ? "min" : "mins"} ${seconds} ${
    seconds === 1 ? "sec" : "secs"
  }`;
};

export const getTimeObject = (duration: number) => {
  return {
    minutes: Math.floor(duration / 60),
    seconds: duration % 60,
  };
};

export const createSessions = (sessions: number) => {
  const numArray = Array.from(
    { length: !sessions ? 4 : sessions },
    (_, i) => i
  );

  return numArray.map((num) => ({
    id: num,
    isCompleted: false,
  })) as Session[];
};
