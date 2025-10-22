import { useEffect, useMemo, useState } from "react";
import { getUser as getStoredUser, login as loginFn, signup as signupFn, logout as logoutFn } from "../lib/auth";

import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const u = loginFn(credentials);
      setUser(u);
      return u;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const signup = async (payload) => {
    setError(null);
    try {
      const u = signupFn(payload);
      setUser(u);
      return u;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const logout = () => {
    logoutFn();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, error, login, signup, logout, setError }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
