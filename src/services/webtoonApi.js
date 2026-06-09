import { webtoons } from "../data/mockWebtoons.js";
import { fetchKmasWebtoons, fetchKmasWebtoonByIsbn, fetchKmasWebtoonByTitle } from "./kmasApi.js";

// 웹툰 검색 기능
export async function searchWebtoons({
  keyword = "",
  genre = "전체",
  platform = "전체",
}) {
  const lowerKeyword = keyword.trim().toLowerCase();

  // 목업 데이터에서 검색
  const local = webtoons.filter((w) => {
    const matchKeyword =
      !lowerKeyword ||
      w.title.toLowerCase().includes(lowerKeyword) ||
      w.pictrWritrNm.toLowerCase().includes(lowerKeyword) ||
      w.sntncWritrNm.toLowerCase().includes(lowerKeyword);

    const matchGenre =
      genre === "전체" || w.genre === genre;

    const matchPlatform =
      platform === "전체" || w.platform === platform;

    return matchKeyword && matchGenre && matchPlatform;
  });

  // 2. KMAS API
  const api = await fetchKmasWebtoons(keyword);

  const mergedMap = new Map();

  api.forEach((item) => {
    if (!item.platform) return; 

    const key = `${item.title}-${item.pictrWritrNm}`;

    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        ...item,
        platforms: [item.platform],
      });
    } else {
      mergedMap.get(key).platforms.push(item.platform);
    }
  });

  // KMAS 결과 필터 적용
  const filteredApi = [...mergedMap.values()].filter(
    (item) => {
      const matchGenre =
        genre === "전체" || item.genre === genre;

      const matchPlatform =
        platform === "전체" ||
        item.platform === platform ||
        item.platforms?.includes(platform);

      return matchGenre && matchPlatform;
    }
  );

  // 3. 합치기
  return [...local, ...filteredApi];
}


// 데이터 형태 통일
function normalizeWebtoon(item) {
  if (!item) return null;

  return {
    id: item.id,
    title: item.title ?? "",
    image: item.image ?? "",
    platform: item.platform ?? "",
    platforms: item.platforms ?? [],
    genre: item.genre ?? "기타",
    ageGrade: item.ageGrade ?? "",
    pictrWritrNm: item.pictrWritrNm ?? "",
    sntncWritrNm: item.sntncWritrNm ?? "",
    description: item.description ?? "",
  };
}

// id로 웹툰 찾기
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

    const platforms = [
      ...new Set(
        list.map((item) => item.pltfomCdNm)
      ),
    ];

    return normalizeWebtoon({
      id,
      title: target.title,
      pictrWritrNm: target.pictrWritrNm,
      sntncWritrNm: target.sntncWritrNm,
      genre: target.mainGenreCdNm,
      platform: target.pltfomCdNm,
      platforms: [...new Set(list.map(i => i.pltfomCdNm).filter(Boolean))],
      ageGrade: target.ageGradCdNm,
      description: target.outline,
      image: target.imageDownloadUrl,
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

