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

// 인증 관련 전역 상태를 공유하기 위한 Context 생성
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자 정보
  const [isLoading, setIsLoading] = useState(true); // 로그인 상태를 확인 중인지 여부(로딩 상태)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false); // 비밀번호 재설정 모드인지 여부

  useEffect(() => {
    // 컴포넌트 언마운트 여부 체크 (비동기 상태 업데이트 방지용)
    let isMounted = true;

    // 최초 실행 시 현재 로그인된 사용자 정보 가져오기
    getCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user); // 로그인된 유저 저장
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false); // 초기 로딩 종료
        }
      });

    // 로그인 상태 변화(로그인/로그아웃/비밀번호 재설정 등) 감지
    const subscription = onAuthStateChange(({ user, event }) => {
      setCurrentUser(user); // 현재 사용자 업데이트
      setIsPasswordRecovery(event === "PASSWORD_RECOVERY"); // 이벤트가 비밀번호 복구 상태인지 체크
      setIsLoading(false); // 상태 확인 완료
    });

    // cleanup: 컴포넌트 언마운트 시 이벤트 듣는 거 해제
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 회원가입 처리 함수
  const signup = async (form) => {
    const result = await signupUser(form);

    if (result.ok) {
      setCurrentUser(result.user); // 가입 성공 시 자동 로그인 처리
    }

    return result;
  };

   // 로그인 처리 함수
  const login = async (form) => {
    const result = await loginUser(form);

    if (result.ok) {
      setCurrentUser(result.user);  // 로그인 성공 시 사용자 정보 저장
    }

    return result;
  };

  // 로그아웃 처리 함수
  const logout = async () => {
    const result = await logoutUser();

    if (result.ok) {
      setCurrentUser(null); // 사용자 정보 초기화
      setIsPasswordRecovery(false); // 복구 상태도 초기화
    }

    return result;
  };

  // 사용자 프로필 업데이트 함수
  const updateProfile = async (nextProfile) => {
    if (!currentUser) return; // 로그인 안 된 상태면 실행 안 함

    const result = await updateUserProfile(currentUser.id, nextProfile);

    if (result.ok) {
      setCurrentUser(result.user); // 업데이트된 사용자 정보 반영
    }

    return result;
  };

  // 비밀번호 재설정 완료 처리
  const completePasswordReset = async (form) => {
    const result = await completePasswordResetUser(form);

    if (result.ok) {
      setIsPasswordRecovery(false); // 복구 모드 종료
      await logout(); // 보안상 로그아웃 처리
    }

    return result;
  };

  return (
    // Context Provider로 전역 인증 상태와 함수 제공
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

// Context Provider로 전역 인증 상태와 함수 제공
export function useAuth() {
  return useContext(AuthContext);
}
