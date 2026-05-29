import { useState } from "react";
import WebtoonGrid from "../../components/Webtoon/WebtoonGrid.jsx";
import WeatherSummary from "../../components/WeatherSummary/WeatherSummary.jsx";
import MoodSelector from "../../components/MoodSelector/MoodSelector.jsx";
import RecommendationQuiz from "../../components/RecommendationQuiz/RecommendationQuiz.jsx";
import { webtoons } from "../../data/mockWebtoons.js";
import "./Home.css";
import Button from "../../components/ui/Button.jsx";
import SectionTitle from "../../components/ui/SectionTitle.jsx";

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
        <section className="card recommend-result">
          <SectionTitle
            eyebrow="추천 결과"
            title="오늘의 추천 웹툰 6개"
            description={recommendation.reason}
          />
          <WebtoonGrid webtoons={recommendation.items} />
        </section>
      )}

      <section>
        <SectionTitle
          eyebrow="인기 웹툰"
          title="현재 많이 찾는 작품"
        />
        <WebtoonGrid webtoons={popularWebtoons} />
      </section>
    </div>
  );
}

export default Home;
