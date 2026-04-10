import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, validate JWT by fetching the persisted user from protected /users/:id.
  useEffect(() => {
    async function checkAuth() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (!storedUser?.id) {
          setUser(null);
          setGmailConnected(false);
          setOutlookConnected(false);
          localStorage.removeItem("user");
          return;
        }

        const res = await api.get(`/users/${storedUser.id}`);
        const userFromApi = res.data?.data;

        const normalizedUser = {
          id: userFromApi.id,
          name: userFromApi.name,
          email: userFromApi.email,
        };

        setUser(normalizedUser);
        setGmailConnected(Boolean(userFromApi?.gmailConnected));
        setOutlookConnected(Boolean(userFromApi?.outlookConnected));
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch {
        // JWT expired or missing – clear any stale local data
        setUser(null);
        setGmailConnected(false);
        setOutlookConnected(false);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (userData) => {
    const normalizedUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };

    setUser(normalizedUser);
    setGmailConnected(Boolean(userData.gmailConnected));
    setOutlookConnected(Boolean(userData.outlookConnected));
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const updateProfile = (partialUserData) => {
    setUser((prev) => {
      const nextUser = {
        ...(prev || {}),
        ...(partialUserData || {}),
      };

      if (nextUser?.id) {
        localStorage.setItem("user", JSON.stringify(nextUser));
      }

      return nextUser;
    });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setGmailConnected(false);
      setOutlookConnected(false);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, gmailConnected, outlookConnected, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

