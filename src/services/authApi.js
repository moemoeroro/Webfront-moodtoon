import { seedUsers } from "../data/mockUsers.js";

const MOCK_USERS_KEY = "moodtoon_mock_users";
const LEGACY_USERS_KEY = "moodtoon_users";
const MOCK_LATENCY = 180;

const defaultProfile = {
  favoriteGenres: ["로맨스", "판타지"],
  likedWebtoonIds: [],
  moodLogs: [],
  likedComments: [],
};

function wait(ms = MOCK_LATENCY) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix = "u") {
  if (crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeUsername(username = "") {
  return username.trim().toLowerCase();
}

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function normalizePhone(phone = "") {
  return phone.replace(/\D/g, "");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUsername(username) {
  return /^[a-z0-9_]{4,20}$/.test(username);
}

function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

function isValidPhone(phone) {
  return /^01[016789]\d{7,8}$/.test(phone);
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const source = encoder.encode(`${salt}:${password}`);
  const buffer = await crypto.subtle.digest("SHA-256", source);

  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createUserRecord(user) {
  const username = normalizeUsername(user.username);
  const email = normalizeEmail(user.email);
  const phone = normalizePhone(user.phone);
  const salt = createId("salt");

  return {
    ...defaultProfile,
    ...user,
    id: user.id || createId("u"),
    username,
    email,
    phone,
    passwordSalt: salt,
    passwordHash: await hashPassword(user.password, salt),
    password: undefined,
    createdAt: user.createdAt || new Date().toISOString(),
  };
}

async function createSeedRecords() {
  return Promise.all(seedUsers.map((user) => createUserRecord(user)));
}

async function migrateLegacyUsers() {
  const legacyUsers = readStorage(LEGACY_USERS_KEY, []);

  if (!Array.isArray(legacyUsers) || legacyUsers.length === 0) {
    return [];
  }

  return Promise.all(
    legacyUsers
      .filter((user) => user.email && user.password)
      .map((user) => {
        const email = normalizeEmail(user.email);
        const username = normalizeUsername(
          user.username || email.split("@")[0] || user.nickname
        );

        return createUserRecord({
          ...defaultProfile,
          ...user,
          username,
          email,
          phone: normalizePhone(user.phone || ""),
          nickname: user.nickname || username,
        });
      })
  );
}

async function getUsers() {
  const savedUsers = readStorage(MOCK_USERS_KEY, null);

  if (Array.isArray(savedUsers)) {
    return savedUsers;
  }

  const migratedUsers = await migrateLegacyUsers();
  const users = migratedUsers.length > 0 ? migratedUsers : await createSeedRecords();
  writeStorage(MOCK_USERS_KEY, users);
  return users;
}

function saveUsers(users) {
  writeStorage(MOCK_USERS_KEY, users);
}

function toSessionUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    favoriteGenres: user.favoriteGenres || defaultProfile.favoriteGenres,
    likedWebtoonIds: user.likedWebtoonIds || defaultProfile.likedWebtoonIds,
    moodLogs: user.moodLogs || defaultProfile.moodLogs,
    likedComments: user.likedComments || defaultProfile.likedComments,
  };
}

function maskUsername(username) {
  if (username.length <= 4) {
    return `${username.slice(0, 2)}**`;
  }

  return `${username.slice(0, 4)}${"*".repeat(username.length - 4)}`;
}

export function sanitizeSessionUser(user) {
  return toSessionUser(user);
}

export async function login({ username, password }) {
  await wait();

  const normalizedUsername = normalizeUsername(username);
  const users = await getUsers();
  const foundUser = users.find((user) => user.username === normalizedUsername);

  if (!foundUser) {
    return { ok: false, message: "아이디 또는 비밀번호를 확인해주세요." };
  }

  const passwordHash = await hashPassword(password, foundUser.passwordSalt);

  if (passwordHash !== foundUser.passwordHash) {
    return { ok: false, message: "아이디 또는 비밀번호를 확인해주세요." };
  }

  return { ok: true, user: toSessionUser(foundUser) };
}

export async function signup(form) {
  await wait();

  const username = normalizeUsername(form.username);
  const email = normalizeEmail(form.email);
  const phone = normalizePhone(form.phone);
  const nickname = form.nickname.trim();

  if (!isValidUsername(username)) {
    return {
      ok: false,
      message: "아이디는 영문 소문자, 숫자, 밑줄로 4~20자 입력해주세요.",
    };
  }

  if (!nickname) {
    return { ok: false, message: "닉네임을 입력해주세요." };
  }

  if (!isEmail(email)) {
    return { ok: false, message: "올바른 이메일을 입력해주세요." };
  }

  if (!isValidPhone(phone)) {
    return { ok: false, message: "전화번호는 01012345678 형식으로 입력해주세요." };
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

  const users = await getUsers();

  if (users.some((user) => user.username === username)) {
    return { ok: false, message: "이미 사용 중인 아이디입니다." };
  }

  if (users.some((user) => user.email === email)) {
    return { ok: false, message: "이미 가입된 이메일입니다." };
  }

  if (users.some((user) => user.phone === phone)) {
    return { ok: false, message: "이미 가입된 전화번호입니다." };
  }

  const newUser = await createUserRecord({
    username,
    password: form.password,
    nickname,
    email,
    phone,
    favoriteGenres: form.favoriteGenres || defaultProfile.favoriteGenres,
  });

  const nextUsers = [...users, newUser];
  saveUsers(nextUsers);

  return { ok: true, user: toSessionUser(newUser) };
}

export async function findUsername({ contact }) {
  await wait();

  const trimmedContact = contact.trim();
  const normalizedContact = trimmedContact.includes("@")
    ? normalizeEmail(trimmedContact)
    : normalizePhone(trimmedContact);

  const users = await getUsers();
  const foundUsers = users.filter(
    (user) => user.email === normalizedContact || user.phone === normalizedContact
  );

  if (foundUsers.length === 0) {
    return { ok: false, message: "일치하는 계정을 찾을 수 없습니다." };
  }

  return {
    ok: true,
    usernames: foundUsers.map((user) => maskUsername(user.username)),
  };
}

export async function resetPassword(form) {
  await wait();

  const username = normalizeUsername(form.username);
  const contact = form.contact.trim();
  const normalizedContact = contact.includes("@")
    ? normalizeEmail(contact)
    : normalizePhone(contact);

  if (!isValidPassword(form.password)) {
    return {
      ok: false,
      message: "새 비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.",
    };
  }

  if (form.password !== form.passwordConfirm) {
    return { ok: false, message: "새 비밀번호 확인이 일치하지 않습니다." };
  }

  const users = await getUsers();
  const userIndex = users.findIndex(
    (user) =>
      user.username === username &&
      (user.email === normalizedContact || user.phone === normalizedContact)
  );

  if (userIndex < 0) {
    return { ok: false, message: "아이디와 계정 정보가 일치하지 않습니다." };
  }

  const nextUsers = [...users];
  const passwordSalt = createId("salt");
  nextUsers[userIndex] = {
    ...nextUsers[userIndex],
    passwordSalt,
    passwordHash: await hashPassword(form.password, passwordSalt),
  };

  saveUsers(nextUsers);

  return { ok: true, message: "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요." };
}

export async function updateProfile(userId, nextProfile) {
  await wait(90);

  const users = await getUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex < 0) {
    return { ok: false, message: "사용자 정보를 찾을 수 없습니다." };
  }

  const nextUsers = [...users];
  nextUsers[userIndex] = {
    ...nextUsers[userIndex],
    ...nextProfile,
  };
  saveUsers(nextUsers);

  return { ok: true, user: toSessionUser(nextUsers[userIndex]) };
}
