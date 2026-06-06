import { webtoons } from "../data/mockWebtoons.js";
import { fetchKmasWebtoons, fetchKmasWebtoonByIsbn, fetchKmasWebtoonByTitle } from "./kmasApi.js";

// 검색 기능
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


// 데이터 형태 통일
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

// 전체 웹툰 가져오기
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

  const local = webtoons.find((w) => w.id === id);

  if (local) {
    return normalizeWebtoon(local);
  }

  // ISBN 없는 KMAS 작품
  if (id.includes("|||")) {

    const [title, platform] = id.split("|||");

    const list = await fetchKmasWebtoonByTitle(title);

    const target = list.find(
      (item) => item.pltfomCdNm === platform
    );

    if (!target) return null;

    return normalizeWebtoon({
      id,
      title: target.title,
      pictrWritrNm: target.pictrWritrNm,
      sntncWritrNm: target.sntncWritrNm,
      genre: target.mainGenreCdNm,
      platform: target.pltfomCdNm,
      description: target.outline,
      image: target.imageDownloadUrl,
      tags: [],
    });
  }

  // ISBN 있는 작품
  return await fetchKmasWebtoonByIsbn(id);
}


// 추천 기능
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

