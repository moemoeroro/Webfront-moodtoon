export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("위치 정보를 지원하지 않는 브라우저입니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export async function getLocationName(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    language: "ko",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/reverse?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("지역명을 불러오지 못했습니다.");
  }

  const data = await response.json();

  return data.results?.[0]?.name ?? "현재 위치";
}