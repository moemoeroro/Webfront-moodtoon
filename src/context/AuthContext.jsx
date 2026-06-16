import { createContext, useContext, useEffect, useState } from "react";
import {
  completePasswordReset as completePasswordResetUser,
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  onAuthStateChange,
  signup as signupUser,
  updateProfile as updateUserProfile,
} from "../services/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자
  const [isLoading, setIsLoading] = useState(true); // 로그인 상태 확인 중인지
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false); // 비밀번호 재설정 모드인지

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const subscription = onAuthStateChange(({ user, event }) => {
      setCurrentUser(user);
      setIsPasswordRecovery(event === "PASSWORD_RECOVERY");
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  const logout = async () => {
    const result = await logoutUser();

    if (result.ok) {
      setCurrentUser(null);
      setIsPasswordRecovery(false);
    }

    return result;
  };

  const updateProfile = async (nextProfile) => {
    if (!currentUser) return;

    const result = await updateUserProfile(currentUser.id, nextProfile);

    if (result.ok) {
      setCurrentUser(result.user);
    }

    return result;
  };

  const completePasswordReset = async (form) => {
    const result = await completePasswordResetUser(form);

    if (result.ok) {
      setIsPasswordRecovery(false);
      await logout();
    }

    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        completePasswordReset,
        currentUser,
        isLoading,
        isPasswordRecovery,
        login,
        logout,
        signup,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
