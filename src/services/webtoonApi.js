import { webtoons } from "../data/mockWebtoons.js";

export async function fetchWebtoons() {
  // 만화규장각 API를 연결할 때 이 함수 내부만 교체하면 됩니다.
  return webtoons;
}

export async function searchWebtoons({ keyword = "", genre = "전체", platform = "전체" }) {
  const items = await fetchWebtoons();
  const lowerKeyword = keyword.trim().toLowerCase();

  return items.filter((webtoon) => {
    const matchesKeyword =
      !lowerKeyword ||
      webtoon.title.toLowerCase().includes(lowerKeyword) ||
      webtoon.pictrWritrNm.toLowerCase().includes(lowerKeyword) ||
      webtoon.sntncWritrNm.toLowerCase().includes(lowerKeyword) ||
      webtoon.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword));
    const matchesGenre = genre === "전체" || webtoon.genre === genre;
    const matchesPlatform = platform === "전체" || webtoon.platform === platform;

    return matchesKeyword && matchesGenre && matchesPlatform;
  });
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

