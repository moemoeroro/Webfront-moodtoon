import { isSupabaseConfigured, supabase } from "./supabaseClient.js";

// 신규 사용자 기본 프로필
const defaultProfile = {
  favoriteGenres: ["romance", "fantasy"],
  likedWebtoonIds: [],
  moodLogs: [],
  likedComments: [],
};

// 아이디를 소문자로 통일
function normalizeUsername(username = "") {
  return username.trim().toLowerCase();
}

// 이메일을 소문자로 통일
function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

// 이메일 형식 검증
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// 아이디 형식 검증
// 영문 소문자, 숫자, 밑줄 허용
function isValidUsername(username) {
  return /^[a-z0-9_]{4,20}$/.test(username);
}

// 비밀번호 형식 검증
// 영문 + 숫자 포함 + 8자 이상
function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

// Supabase 연결 여부 확인
function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      message:
        "Supabase 환경변수가 설정되지 않았습니다. .env에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 추가해 주세요.",
    };
  }

  return null;
}


// 아이디 일부 마스킹 처리(보안을 위해)
function maskUsername(username = "") {
  if (username.length <= 4) {
    return `${username.slice(0, 2)}**`;
  }

  return `${username.slice(0, 4)}${"*".repeat(username.length - 4)}`;
}

// DB 프로필과 Auth 사용자 정보를
// 화면에서 사용하는 User 객체로 변환
function toSessionUser(profile, authUser) {
  if (!profile && !authUser) return null;

  const metadata = authUser?.user_metadata || {};

  return {
    id: profile?.id || authUser?.id,
    username: profile?.username || metadata.username || "",
    email: profile?.email || authUser?.email || "",
    nickname:
      profile?.nickname || metadata.nickname || metadata.username || "user",
    favoriteGenres:
      profile?.favorite_genres ||
      metadata.favoriteGenres ||
      defaultProfile.favoriteGenres,
    likedWebtoonIds:
      profile?.liked_webtoon_ids || defaultProfile.likedWebtoonIds,
    moodLogs: profile?.mood_logs || defaultProfile.moodLogs,
    likedComments: profile?.liked_comments || defaultProfile.likedComments,
  };
}

// 화면용 프로필 데이터를 DB 컬럼명 형식으로 변환
function toProfilePatch(nextProfile) {
  const patch = {};

  if ("username" in nextProfile) {
    patch.username = normalizeUsername(nextProfile.username);
  }

  if ("nickname" in nextProfile) {
    patch.nickname = nextProfile.nickname;
  }

  if ("favoriteGenres" in nextProfile) {
    patch.favorite_genres = nextProfile.favoriteGenres;
  }

  if ("likedWebtoonIds" in nextProfile) {
    patch.liked_webtoon_ids = nextProfile.likedWebtoonIds;
  }

  if ("moodLogs" in nextProfile) {
    patch.mood_logs = nextProfile.moodLogs;
  }

  if ("likedComments" in nextProfile) {
    patch.liked_comments = nextProfile.likedComments;
  }

  return patch;
}

// 비밀번호 재설정 후 이동할 URL 생성
function getRedirectUrl(path = "/find-account") {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${path}`;
}

/*
 * 로그인 시 사용자의 이메일 조회
 * - 이메일 입력 → 그대로 사용
 * - 아이디 입력 → RPC로 이메일 검색
 */
async function findLoginEmail(identifier) {
  const normalizedIdentifier = identifier.trim();

  if (isEmail(normalizedIdentifier)) {
    return normalizeEmail(normalizedIdentifier);
  }

  const username = normalizeUsername(normalizedIdentifier);
  const { data, error } = await supabase.rpc("find_profile_by_username", {
    p_username: username,
  });

  if (error) {
    throw new Error(
      "아이디 조회용 Supabase RPC가 준비되지 않았습니다. supabase/schema.sql을 먼저 실행해 주세요."
    );
  }

  return data?.[0]?.email || "";
}

// Profiles 테이블에서 사용자 프로필 조회
async function fetchProfile(authUser) {
  if (!authUser) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      "프로필을 불러오지 못했습니다. profiles 테이블과 RLS 정책을 확인해 주세요."
    );
  }

  return toSessionUser(data, authUser);
}

// 세션 사용자 객체 정리
export function sanitizeSessionUser(user) {
  return user ? { ...defaultProfile, ...user } : null;
}




/*===========================
인증 관련 함수
============================*/


// 현재 로그인 사용자 조회
export async function getCurrentUser() {
  const configError = requireSupabase();
  if (configError) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return fetchProfile(user);
}

// 로그인 상태 변경 감지
// (로그인 / 로그아웃 시 자동 실행)
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured || !supabase) {
    return { unsubscribe: () => {} };
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_OUT" || !session?.user) {
      callback({ user: null, event });
      return;
    }

    try {
      const user = await fetchProfile(session.user);
      callback({ user, event });
    } catch {
      callback({ user: null, event });
    }
  });

  return subscription;
}

// 로그인 
// 아이디 -> 이메일 변환 후, Supabase Auth 로그인
export async function login({ username, password }) {
  const configError = requireSupabase();
  if (configError) return configError;

  try {
    const email = await findLoginEmail(username);

    if (!email) {
      return { ok: false, message: "아이디 또는 비밀번호를 확인해 주세요." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { ok: false, message: "아이디 또는 비밀번호를 확인해 주세요." };
    }

    const user = await fetchProfile(data.user);

    return { ok: true, user };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

// 회원가입
// 입력값 검증 후 Auth 계정 생성
export async function signup(form) {
  const configError = requireSupabase();
  if (configError) return configError;

  const username = normalizeUsername(form.username);
  const email = normalizeEmail(form.email);
  const nickname = form.nickname.trim();

  if (!isValidUsername(username)) {
    return {
      ok: false,
      message: "아이디는 영문 소문자, 숫자, 밑줄로 4~20자 입력해 주세요.",
    };
  }

  if (!nickname) {
    return { ok: false, message: "닉네임을 입력해 주세요." };
  }

  if (!isEmail(email)) {
    return { ok: false, message: "올바른 이메일을 입력해 주세요." };
  }

  if (!isValidPassword(form.password)) {
    return {
      ok: false,
      message: "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.",
    };
  }

  if (form.password !== form.passwordConfirm) {
    return { ok: false, message: "비밀번호 확인이 일치하지 않습니다." };
  }

  try {
    const existingEmail = await findLoginEmail(username);

    if (existingEmail) {
      return { ok: false, message: "이미 사용 중인 아이디입니다." };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        data: {
          favoriteGenres:
            form.favoriteGenres || defaultProfile.favoriteGenres,
          nickname,
          username,
        },
      },
    });

    if (error) {
      return {
        ok: false,
        message:
          error.status === 422
            ? "이미 가입된 이메일이거나 사용할 수 없는 정보입니다."
            : error.message,
      };
    }

    if (!data.session) {
      return {
        ok: false,
        message:
          "가입 확인 메일을 보냈습니다. 이메일 인증을 마친 뒤 로그인해 주세요.",
      };
    }

    const user = await fetchProfile(data.user);

    return { ok: true, user };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}


// 로그아웃
export async function logout() {
  const configError = requireSupabase();
  if (configError) return configError;

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, message: "로그아웃에 실패했습니다." };
  }

  return { ok: true };
}



/*===========================
계정 찾기 / 비밀번호 찾기
============================*/


// 이메일로 가입된 아이디 조회
export async function findUsername({ contact }) {
  const configError = requireSupabase();
  if (configError) return configError;

  const normalizedContact = normalizeEmail(contact);

  if (!isEmail(normalizedContact)) {
    return { ok: false, message: "올바른 이메일을 입력해 주세요." };
  }

  const { data, error } = await supabase.rpc("find_usernames_by_email", {
    p_email: normalizedContact,
  });

  if (error) {
    return {
      ok: false,
      message:
        "아이디 찾기용 Supabase RPC가 준비되지 않았습니다. supabase/schema.sql을 먼저 실행해 주세요.",
    };
  }

  if (!data || data.length === 0) {
    return { ok: false, message: "일치하는 계정을 찾을 수 없습니다." };
  }

  return {
    ok: true,
    usernames: data.map((user) => maskUsername(user.username)),
  };
}


// 비밀번호 재설정 메일 발송
export async function resetPassword(form) {
  const configError = requireSupabase();
  if (configError) return configError;

  const username = normalizeUsername(form.username);
  const normalizedContact = normalizeEmail(form.contact);

  if (!isValidUsername(username) || !isEmail(normalizedContact)) {
    return { ok: false, message: "아이디와 이메일을 확인해 주세요." };
  }

  const { data, error } = await supabase.rpc("find_profile_by_username", {
    p_username: username,
  });

  if (error) {
    return {
      ok: false,
      message:
        "비밀번호 재설정용 Supabase RPC가 준비되지 않았습니다. supabase/schema.sql을 먼저 실행해 주세요.",
    };
  }

  if (!data?.[0] || data[0].email !== normalizedContact) {
    return {
      ok: false,
      message: "아이디와 계정 이메일이 일치하지 않습니다.",
    };
  }

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    normalizedContact,
    {
      redirectTo: getRedirectUrl("/find-account?mode=recovery"),
    }
  );

  if (resetError) {
    return { ok: false, message: "재설정 메일 발송에 실패했습니다." };
  }

  return {
    ok: true,
    message:
      "비밀번호 재설정 메일을 보냈습니다. 메일의 링크를 열어 새 비밀번호를 설정해 주세요.",
  };
}

// 비밀번호 재설정 완료
// 메일 링크 진입 후 새 비밀번호 저장
export async function completePasswordReset(form) {
  const configError = requireSupabase();
  if (configError) return configError;

  if (!isValidPassword(form.password)) {
    return {
      ok: false,
      message: "새 비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.",
    };
  }

  if (form.password !== form.passwordConfirm) {
    return { ok: false, message: "새 비밀번호 확인이 일치하지 않습니다." };
  }

  const { error } = await supabase.auth.updateUser({
    password: form.password,
  });

  if (error) {
    return {
      ok: false,
      message: "비밀번호를 변경하지 못했습니다. 재설정 링크를 다시 요청해 주세요.",
    };
  }

  return {
    ok: true,
    message: "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.",
  };
}



/*===========================
프로필 수정
============================*/

// 사용자 프로필 수정
// 선호 장르, 좋아요 목록 등 저장
export async function updateProfile(userId, nextProfile) {
  const configError = requireSupabase();
  if (configError) return configError;

  const patch = toProfilePatch(nextProfile);

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    return { ok: false, message: "사용자 정보를 저장하지 못했습니다." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { ok: true, user: toSessionUser(data, user) };
}
