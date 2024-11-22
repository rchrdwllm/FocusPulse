import { create } from "zustand";

type InitialStateType = {
  autoStartBreaks: boolean;
  autoStartPomodoro: boolean;
  setAutoStartBreaks: (value: boolean) => any;
};

export const useSettingsStore = create((set) => ({
  autoStartBreaks: false,
  autoStartPomodoro: false,
  setAutoStartBreaks: (value: boolean) =>
    set((state: InitialStateType) => ({
      autoStartBreaks: value,
    })),
  setAutoStartPomodoro: (value: boolean) =>
    set((state: InitialStateType) => ({
      autoStartPomodoro: value,
    })),
}));
