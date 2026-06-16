import { useEffect, useState } from "react";
import { getCurrentLocation, getLocationName } from "../../services/locationApi";
import { fetchCurrentWeather, fetchSeoulWeather } from "../../services/weatherApi";
import "./WeatherSummary.css";

const weatherIcons = {
  sunny: "☀️",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
};

function WeatherSummary({ onWeatherChange }) {
  const [weather, setWeather] = useState({
    city: "위치 정보를 불러오는 중",
    temperature: "--",
    type: "cloudy",
  });
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;

    async function loadWeather() {
      try {
        // 좌표 가져오기
        const coords = await getCurrentLocation();

        // 도시명 가져오기
        const city = await getLocationName(
          coords.latitude,
          coords.longitude
        );

        // 날씨 요청
        const nextWeather = await fetchCurrentWeather({
          ...coords,
          name: city,
        });

        if (!ignore) {
          setWeather(nextWeather);
          onWeatherChange(nextWeather);
          setStatus("done");
        }
      } catch (error) {
        console.error(error);

        const nextWeather = await fetchSeoulWeather();

        if (!ignore) {
          setWeather(nextWeather);
          onWeatherChange(nextWeather);
          setStatus("fallback");
        }
      }
    }

    loadWeather();

    return () => {
      ignore = true;
    };
  }, [onWeatherChange]);

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
          ? "현재 위치의 날씨 정보를 불러오고 있어요." 
          : "현재 날씨를 오늘의 웹툰 추천 기준에 반영했어요."}
      </p>
    </section>
  );
}

export default WeatherSummary;

