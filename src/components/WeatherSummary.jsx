import { useEffect, useState } from "react";
import { fetchSeoulWeather } from "../services/weatherApi.js";

function WeatherSummary({ onWeatherChange }) {
  const [weather, setWeather] = useState({
    city: "서울",
    text: "눈",
    temperature: 13,
    type: "snowy",
  });
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;

    async function loadWeather() {
      try {
        const nextWeather = await fetchSeoulWeather();
        if (!ignore) {
          setWeather(nextWeather);
          onWeatherChange(nextWeather);
          setStatus("done");
        }
      } catch {
        if (!ignore) {
          onWeatherChange(weather);
          setStatus("fallback");
        }
      }
    }

    loadWeather();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="summary-card weather-summary">
      <p className="eyebrow">오늘의 날씨</p>
      <h2>
        {weather.city}, {weather.text} {weather.temperature}°C
      </h2>
      <p>
        {status === "loading"
          ? "날씨 정보를 불러오는 중입니다."
          : "현재 날씨를 추천 기준에 반영합니다."}
      </p>
    </section>
  );
}

export default WeatherSummary;

