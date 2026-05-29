import { useEffect, useState } from "react";
import { fetchSeoulWeather } from "../../services/weatherApi.js";
import "./WeatherSummary.css";

const weatherIcons = {
  sunny: "☀️",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
};

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
    <section className="card info-card weather-summary">
      <div className="info-card-top">
        <div>
          <p className="eyebrow">오늘의 날씨</p>
          <h2>
            {weather.city}, {weather.text}
          </h2>
        </div>
        <div className={`weather-icon weather-${weather.type}`} aria-hidden="true">
          {weatherIcons[weather.type] || "☁️"}
        </div>
      </div>

      <div className="weather-temp">
        <span>{weather.temperature}°C</span>
        <small>{status === "loading" ? "업데이트 중" : "추천에 반영됨"}</small>
      </div>

      <p>
        {status === "loading"
          ? "서울 기준 날씨 정보를 불러오고 있어요."
          : "현재 날씨를 오늘의 웹툰 추천 기준에 반영했어요."}
      </p>
    </section>
  );
}

export default WeatherSummary;

