"use client";

import { createContext, useContext } from "react";
import { useTheme } from "next-themes";

interface DarkModeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode(): DarkModeContextValue {
  return useContext(DarkModeContext);
}
