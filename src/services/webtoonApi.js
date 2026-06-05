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

  // 3. 합치기
  return [...local, ...api];
}

export async function fetchWebtoonById(id) {
  const items = await fetchWebtoons();
  return items.find((webtoon) => webtoon.id === id);
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

