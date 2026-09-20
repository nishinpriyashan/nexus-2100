import { useEffect, useState, useCallback } from "react";
import { ThemeContext } from "./themeContextValue";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme() {
  try {
    return localStorage.getItem("nexus-theme") || "system";
  } catch {
    return "system";
  }
}

function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getStoredTheme());
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("nexus-theme", newTheme);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(getSystemTheme());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
