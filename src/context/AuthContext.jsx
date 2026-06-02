import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginUser,
  sanitizeSessionUser,
  signup as signupUser,
  updateProfile as updateUserProfile,
} from "../services/authApi.js";

const AuthContext = createContext(null);
const CURRENT_USER_KEY = "moodtoon_current_user";

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? sanitizeSessionUser(JSON.parse(saved)) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(CURRENT_USER_KEY, null)
  );

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const signup = async (form) => {
    const result = await signupUser(form);

    if (result.ok) {
      setCurrentUser(result.user);
    }

    return result;
  };

  const login = async (form) => {
    const result = await loginUser(form);

    if (result.ok) {
      setCurrentUser(result.user);
    }

    return result;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (nextProfile) => {
    if (!currentUser) return;

    const result = await updateUserProfile(currentUser.id, nextProfile);

    if (result.ok) {
      setCurrentUser(result.user);
    }

    return result;
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, signup, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

