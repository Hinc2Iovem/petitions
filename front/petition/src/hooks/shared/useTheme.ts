import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

export default function useTheme() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error(`useTheme must be used within an ThemeProvider`);
  }

  return themeContext;
}
