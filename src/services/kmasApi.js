const API_KEY = import.meta.env.VITE_KMAS_KEY;

export async function fetchKmasWebtoons(keyword = "") {
  try {
    const query = keyword
      ? `&title=${encodeURIComponent(keyword)}`
      : "";

    const res = await fetch(
      `/kmas/openapi/search/bookAndWebtoonList?prvKey=${API_KEY}${query}`
    );

    const data = await res.json();

    return (data.itemList || []).map((item) => ({
      id: item.isbn,
      title: item.title,
      pictrWritrNm: item.pictrWritrNm,
      sntncWritrNm: item.sntncWritrNm,
      genre: item.mainGenreCdNm,
      platform: item.pltfomCdNm,
      description: item.outline,
      image: item.imageDownloadUrl,
      tags: [],
    }));
  } catch (err) {
    console.error("KMAS API 실패:", err);
    return [];
  }
}

