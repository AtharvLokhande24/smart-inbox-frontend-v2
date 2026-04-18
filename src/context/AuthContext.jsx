import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function deriveConnections(userData = {}) {
  const accounts = Array.isArray(userData.accounts) ? userData.accounts : [];
  const providers = new Set(
    accounts.map((account) => String(account?.provider || "").trim().toLowerCase())
  );

  const gmailConnected =
    typeof userData.gmailConnected === "boolean"
      ? userData.gmailConnected
      : providers.has("gmail");

  const outlookConnected =
    typeof userData.outlookConnected === "boolean"
      ? userData.outlookConnected
      : providers.has("outlook");

  return { gmailConnected, outlookConnected };
}

function getDisplayName(userData = {}) {
  const accounts = Array.isArray(userData.accounts) ? userData.accounts : [];
  const primaryAccount = accounts.find((account) => account?.is_primary) || accounts[0] || null;
  const accountName = primaryAccount?.display_name || primaryAccount?.email?.split("@")[0] || null;
  const rawName = String(userData.name || "").trim();

  if (rawName && rawName.toLowerCase() !== "user") {
    return rawName;
  }

  return accountName || rawName || "User";
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, validate JWT by fetching the persisted user from protected /users/:id.
  useEffect(() => {
    async function checkAuth() {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      try {
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
          name: getDisplayName(userFromApi),
          email: userFromApi.email,
          accounts: Array.isArray(userFromApi.accounts) ? userFromApi.accounts : [],
        };
        const { gmailConnected, outlookConnected } = deriveConnections(userFromApi);

        setUser(normalizedUser);
        setGmailConnected(gmailConnected);
        setOutlookConnected(outlookConnected);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch {
        // Keep the stored user so the UI can still show the last known profile/accounts.
        if (storedUser?.id) {
          const fallbackUser = {
            id: storedUser.id,
            name: getDisplayName(storedUser),
            email: storedUser.email,
            accounts: Array.isArray(storedUser.accounts) ? storedUser.accounts : [],
          };
          const { gmailConnected, outlookConnected } = deriveConnections(fallbackUser);

          setUser(fallbackUser);
          setGmailConnected(gmailConnected);
          setOutlookConnected(outlookConnected);
          localStorage.setItem("user", JSON.stringify(fallbackUser));
        } else {
          setUser(null);
          setGmailConnected(false);
          setOutlookConnected(false);
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (userData) => {
    const normalizedUser = {
      id: userData.id,
      name: getDisplayName(userData),
      email: userData.email,
      accounts: Array.isArray(userData.accounts) ? userData.accounts : [],
    };
    const { gmailConnected, outlookConnected } = deriveConnections(userData);

    setUser(normalizedUser);
    setGmailConnected(gmailConnected);
    setOutlookConnected(outlookConnected);
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

