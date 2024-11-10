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
