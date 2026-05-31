import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { login as loginApi, LoginData } from "../api/AuthService";

interface UserType {
  email: string;
  role: "admin" | "user";
  firstName: string;
  lastName: string;
}

interface AuthType {
  user: UserType | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data: LoginData) => {
    const res = await loginApi(data);

const userObj = {
  email: (res as any).email || data.email,
  role: (res as any).role || "user",
  firstName: (res as any).firstName || (res as any).first_name || "",
  lastName: (res as any).lastName || (res as any).last_name || "",
};

    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));

    if (res.AccessToken) {
      localStorage.setItem("AccessToken", res.AccessToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("AccessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};