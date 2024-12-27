import { createContext, useEffect, useState } from "react";

type AuthContextTypes = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export const AuthContext = createContext({} as AuthContextTypes);

type AuthProviderTypes = {
  children: React.ReactNode;
};
export default function AuthProvider({ children }: AuthProviderTypes) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setToken(token);
    }
  }, []);
  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}
