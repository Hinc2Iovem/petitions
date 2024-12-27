import { createContext, useEffect, useState } from "react";

export type ThemeTypes = "dark" | "light";

type ThemeContextTypes = {
  theme: ThemeTypes;
  setTheme: React.Dispatch<React.SetStateAction<ThemeTypes>>;
};

export const ThemeContext = createContext({} as ThemeContextTypes);

type ThemeProviderTypes = {
  children: React.ReactNode;
};
export default function ThemeProvider({ children }: ThemeProviderTypes) {
  const [theme, setTheme] = useState<ThemeTypes>("" as ThemeTypes);
  useEffect(() => {
    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      setTheme(selectedTheme as ThemeTypes);
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.body.classList.add("dark");
    } else {
      setTheme("light");
      document.body.classList.add("light");
    }
  }, []);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
