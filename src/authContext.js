import { createContext, useState, useEffect } from "react";
import { login } from "./api";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ ...decoded, token });
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { data } = await login(credentials);
      localStorage.setItem("token", data.token);
      setUser(jwtDecode(data.token));
    } catch (error) {
      console.error("Login failed:", error.response?.data.message);
    }
    useEffect(() => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
    
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};