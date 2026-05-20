export async function searchCity(keyword) {
  const params = new URLSearchParams({
    name: keyword,
    count: "1",
    language: "ko",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("지역 정보를 불러오지 못했습니다.");
  }

  const data = await response.json();
  const firstResult = data.results?.[0];

  if (!firstResult) {
    return null;
  }

  return {
    name: firstResult.name,
    latitude: firstResult.latitude,
    longitude: firstResult.longitude,
  };
}

