const SEOUL = {
  name: "서울",
  latitude: 37.5665,
  longitude: 126.978,
};

export function getWeatherType(code) {
  if (code === 0) return "sunny";
  if (code >= 71 && code <= 77) return "snowy";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rainy";
  return "cloudy";
}

export function getWeatherText(code) {
  const type = getWeatherType(code);
  const labels = {
    sunny: "맑음",
    cloudy: "흐림",
    rainy: "비",
    snowy: "눈",
  };
  return labels[type];
}

export async function fetchCurrentWeather(location = SEOUL) {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "temperature_2m,weather_code",
    timezone: "Asia/Seoul",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("날씨 정보를 불러오지 못했습니다.");
  }

  const data = await response.json();
  const weatherCode = data.current?.weather_code ?? 3;

  return {
    city: location.name,
    temperature: Math.round(data.current?.temperature_2m ?? 13),
    code: weatherCode,
    text: getWeatherText(weatherCode),
    type: getWeatherType(weatherCode),
  };
}

export async function fetchSeoulWeather() {
  return fetchCurrentWeather(SEOUL);
}

