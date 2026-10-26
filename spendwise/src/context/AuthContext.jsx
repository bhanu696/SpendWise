
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("spendwise-token")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("spendwise-user"));
    } catch {
      return null;
    }
  });

  async function authenticate(endpoint, credentials) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    localStorage.setItem("spendwise-token", data.token);
    localStorage.setItem("spendwise-user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  }

  function login(email, password) {
    return authenticate("login", { email, password });
  }

  function register(name, email, password) {
    return authenticate("register", { name, email, password });
  }

  function logout() {
    localStorage.removeItem("spendwise-token");
    localStorage.removeItem("spendwise-user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
