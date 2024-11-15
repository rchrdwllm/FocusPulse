import React, { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { colors } from "@/constants/colors";

type Theme = "system" | "light" | "dark";

interface ThemeContextType  {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    currentColors: typeof colors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>(systemTheme || "light");

    const currentColors = colors[theme === "system" ? systemTheme || "light" : theme];

    const changeTheme = (newTheme: Theme) => {
        if (newTheme === "system") {
            setTheme(systemTheme || "light");
        } else {
            setTheme(newTheme);
        }
    };

    return (
        <ThemeContext.Provider
            value={{ theme, setTheme: changeTheme, currentColors }}>
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