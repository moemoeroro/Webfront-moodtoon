import { useState } from "react";
import WebtoonCard from "../../components/WebtoonCard/WebtoonCard.jsx";
import WeatherSummary from "../../components/WeatherSummary/WeatherSummary.jsx";
import MoodSelector from "../../components/MoodSelector/MoodSelector.jsx";
import RecommendationQuiz from "../../components/RecommendationQuiz/RecommendationQuiz.jsx";
import { webtoons } from "../../data/mockWebtoons.js";
import "./Home.css";
import Button from "../../Components/ui/Button.jsx";

function Home() {
  const [selectedMood, setSelectedMood] = useState("피곤함");
  const [weather, setWeather] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const popularWebtoons = [...webtoons].sort((a, b) => b.likes - a.likes).slice(0, 4);

  return (
    <div className="page home-page">
      {/* 메인 소개 영역 */}
      <section className="hero-section">
        <div>
          <p className="eyebrow">Mood based webtoon platform</p>
          <h1>오늘의 날씨와 감정에 맞는 웹툰을 추천받아보세요</h1>
          <p>
            moodtoon은 날씨, 현재 감정, 선호 장르를 함께 반영해 지금 보기 좋은 웹툰을 추천해주는 서비스입니다.
          </p>
        </div>
        <a className="button primary large shine" href="#recommend">
          추천 시작
        </a>
      </section>

      {/* 날씨 + 감정 */}
      <div className="summary-grid" id="recommend">
        <WeatherSummary onWeatherChange={setWeather} />
        <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
      </div>

      <RecommendationQuiz
        mood={selectedMood}
        weather={weather}
        onResult={setRecommendation}
      />

      {recommendation && (
        <section className="recommend-result">
          <div className="section-title">
            <p className="eyebrow">추천 결과</p>
            <h2>오늘의 추천 웹툰 6개</h2>
            <p>{recommendation.reason}</p>
          </div>
          <div className="webtoon-grid">
            {recommendation.items.map((webtoon) => (
              <WebtoonCard key={webtoon.id} webtoon={webtoon} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="section-title">
          <p className="eyebrow">인기 웹툰</p>
          <h2>현재 많이 찾는 작품</h2>
        </div>
        <div className="webtoon-grid">
          {popularWebtoons.map((webtoon) => (
            <WebtoonCard key={webtoon.id} webtoon={webtoon} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
