import { webtoons } from "../data/mockWebtoons.js";
import { fetchKmasWebtoons } from "./kmasApi.js";

export async function searchWebtoons({ keyword = "", genre = "전체", platform = "전체" }) {
  const lowerKeyword = keyword.trim().toLowerCase();

  
  // 1. 목업 데이터
  const local = webtoons.filter((w) => {
    const matchKeyword =
      !lowerKeyword ||
      w.title.toLowerCase().includes(lowerKeyword) ||
      w.pictrWritrNm.toLowerCase().includes(lowerKeyword) ||
      w.sntncWritrNm.toLowerCase().includes(lowerKeyword);

    const matchGenre = genre === "전체" || w.genre === genre;
    const matchPlatform = platform === "전체" || w.platform === platform;

    return matchKeyword && matchGenre && matchPlatform;
  });

  // 2. KMAS API
  const api = await fetchKmasWebtoons(keyword);

  const safeApi = api.filter(
    (item) => item && item.id && item.title
  );

  // 3. 합치기
  return [...local, ...safeApi];
}

function normalizeWebtoon(item) {
  if (!item) return null;

  return {
    id: item.id,
    title: item.title ?? "",
    image: item.image ?? "",
    platform: item.platform ?? "",
    genre: item.genre ?? "기타",
    pictrWritrNm: item.pictrWritrNm ?? "",
    sntncWritrNm: item.sntncWritrNm ?? "",
    description: item.description ?? "",
    tags: item.tags ?? [],
  };
}

export async function fetchAllWebtoons() {
  const [local, api] = await Promise.all([
    webtoons,
    fetchKmasWebtoons("")
  ]);

  const safeLocal = (local || []).filter(Boolean);

  const safeApi = (api || [])
    .filter(Boolean)
    .filter((item) => item.id && item.title);

  return [...safeLocal, ...safeApi]
    .map(normalizeWebtoon)
    .filter(Boolean);
}

export async function fetchWebtoonById(id) {
  const [local, api] = await Promise.all([
    webtoons,
    fetchKmasWebtoons("")
  ]);

  const safeLocal = local.map(normalizeWebtoon);
  const safeApi = fetchKmasWebtoons("")
    .then(list => list.map(normalizeWebtoon));

  const apiData = await safeApi;

  const all = [...safeLocal, ...apiData];

  console.log("ALL IDS:", all.map(w => w.id));
  console.log("TARGET ID:", id);


  return all.find((w) => w.id === id) || null;
}

export function recommendWebtoons({ mood, weatherType }) {
  const scored = webtoons.map((webtoon) => {
    let score = 0;

    if (webtoon.moods.includes(mood)) score += 3;
    if (webtoon.weather.includes(weatherType)) score += 2;

    return { ...webtoon, score };
  });

  return scored.sort(
    (a, b) => b.score - a.score || b.likes - a.likes
  );
}

