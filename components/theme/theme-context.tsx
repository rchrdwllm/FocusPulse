import { colors } from "@/constants/colors";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform, useColorScheme } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

type Theme = "system" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentColors: typeof colors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemTheme || "light");
  const [currentColors, setCurrentColors] = useState(
    colors[theme === "system" ? systemTheme || "light" : theme]
  );

  useEffect(() => {
    if (theme === "system") {
      setCurrentColors(colors[systemTheme || "light"]);
    } else {
      setCurrentColors(colors[theme]);
    }
  }, [theme, systemTheme]);

  useEffect(() => {
    Platform.OS === "android" &&
      NavigationBar.setBackgroundColorAsync(currentColors.background);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (newTheme === "system") {
      setCurrentColors(colors[systemTheme || "light"]);
    } else {
      setCurrentColors(colors[newTheme]);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: changeTheme, currentColors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
