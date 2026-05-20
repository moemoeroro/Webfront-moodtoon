import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "moodtoon_users";
const CURRENT_USER_KEY = "moodtoon_current_user";

const defaultProfile = {
  favoriteGenres: ["로맨스", "판타지"],
  likedWebtoonIds: ["wind-001", "star-002"],
  comments: [
    {
      webtoonTitle: "비 오는 날의 서점",
      text: "잔잔해서 자기 전에 보기 좋았어요.",
      date: "2026-05-18",
    },
  ],
  moodLogs: ["피곤함", "설렘", "피곤함", "편안함", "피곤함"],
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, []));
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(CURRENT_USER_KEY, null)
  );

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const signup = ({ email, password, nickname }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const alreadyExists = users.some((user) => user.email === normalizedEmail);

    if (alreadyExists) {
      return { ok: false, message: "이미 가입된 이메일입니다." };
    }

    const newUser = {
      id: Date.now().toString(),
      email: normalizedEmail,
      password,
      nickname: nickname.trim(),
      ...defaultProfile,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (user) => user.email === normalizedEmail && user.password === password
    );

    if (!foundUser) {
      return { ok: false, message: "이메일 또는 비밀번호를 확인해주세요." };
    }

    setCurrentUser(foundUser);
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (nextProfile) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...nextProfile };
    setCurrentUser(updatedUser);
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, users, signup, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

