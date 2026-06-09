const API_KEY = import.meta.env.VITE_KMAS_KEY;

function isAdultContent(item) {
  const grade = item.ageGradCdNm || "";

  return grade.includes("18세 이상");
}

export async function fetchKmasWebtoons(keyword = "") {
  try {
    const query = keyword
      ? `&title=${encodeURIComponent(keyword)}`
      : "";

    const res = await fetch(
      `/kmas/openapi/search/bookAndWebtoonList?prvKey=${API_KEY}${query}`
    );

    const data = await res.json();

    console.log("KMAS RAW:", data.itemList);

    return (data.itemList || []).filter((item) => !isAdultContent(item)).map((item) => ({
      id: item.isbn || `${item.title}|||${item.pltfomCdNm}`,
      title: item.title,
      pictrWritrNm: item.pictrWritrNm,
      sntncWritrNm: item.sntncWritrNm,
      genre: item.mainGenreCdNm,
      platform: item.pltfomCdNm,
      ageGrade: item.ageGradCdNm,
      description: item.outline,
      image: item.imageDownloadUrl,
    }));
  } catch (err) {
    console.error("KMAS API 실패:", err);
    return [];
  }
}

export async function fetchKmasWebtoonByIsbn(isbn) {
  try {
    const res = await fetch(
      `/kmas/openapi/search/bookAndWebtoonList?prvKey=${API_KEY}&isbn=${isbn}`
    );

    const data = await res.json();

    console.log("ISBN RESULT:", data);

    const item = data.itemList?.[0];

    if (!item) return null;

    return {
      id: item.isbn,
      title: item.title,
      pictrWritrNm: item.pictrWritrNm,
      sntncWritrNm: item.sntncWritrNm,
      genre: item.mainGenreCdNm,
      platform: item.pltfomCdNm,
      ageGrade: item.ageGradCdNm,
      description: item.outline,
      image: item.imageDownloadUrl,
    };
  } catch (err) {
    console.error("ISBN 조회 실패:", err);
    return null;
  }
}

export async function fetchKmasWebtoonByTitle(title) {
  try {
    const res = await fetch(
      `/kmas/openapi/search/bookAndWebtoonList?prvKey=${API_KEY}&title=${encodeURIComponent(title)}`
    );

    const data = await res.json();

    return (data.itemList || []).filter((item) => !isAdultContent(item));
  } catch (err) {
    console.error(err);
    return [];
  }
}
