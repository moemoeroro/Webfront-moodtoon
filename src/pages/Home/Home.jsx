import { useState } from "react";
import { webtoons, genres, platforms } from "../../data/mockWebtoons.js";
import { recommendWebtoons } from "../../services/webtoonApi.js";
import WebtoonGrid from "../../components/Webtoon/WebtoonGrid.jsx";
import WeatherSummary from "../../components/WeatherSummary/WeatherSummary.jsx";
import MoodSelector from "../../components/MoodSelector/MoodSelector.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionTitle from "../../components/ui/SectionTitle.jsx";
import ChoiceButton from "../../components/ui/ChoiceButton.jsx";
import "./Home.css";

function Home() {
  const [selectedMood, setSelectedMood] = useState("피곤함");
  const [weather, setWeather] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const popularWebtoons = [...webtoons].sort((a, b) => b.likes - a.likes).slice(0, 4);
  
  const handleRecommend = () => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    
    const result = recommendWebtoons({
      mood: selectedMood || "피곤함",
      weatherType: weather?.type || "cloudy",
    });

    setRecommendation({
      items: result,
      reason: `${weather?.text || "흐림"} 날씨와 '${
        selectedMood || "피곤함"
      }' 기분을 반영했습니다.`,
    });
  };

  const filteredRecommendation =
  recommendation?.items.filter((webtoon) => {
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.includes(webtoon.genre);

    const platformMatch =
      selectedPlatforms.length === 0 ||
      selectedPlatforms.includes(webtoon.platform);

    return genreMatch && platformMatch;
  }) || [];

  const finalRecommendation = filteredRecommendation.slice(0, 6);

  return (
    <div className="page home-page">
      {/* 메인 소개 영역 */}
      <section className="hero-section">
        <div>
          <p className="eyebrow">Mood based webtoon platform</p>
          <h1 >오늘의 날씨와 감정에 맞는 웹툰을 추천받아보세요</h1>
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

      <div className="recommend-action">
        <Button
          variant="primary"
          size="large"
          fullWidth
          shine
          onClick={handleRecommend}
        >
          추천받기
        </Button>
      </div>

      {recommendation && (
        <section className="card recommend-result">
          <SectionTitle
            eyebrow="추천 결과"
            title="오늘의 추천 웹툰 6개"
            description={recommendation.reason}
          />
          <div className="recommend-filters">
            <div>
              <h3>장르</h3>

              <div className="choice-grid">
                {genres
                  .filter((genre) => genre !== "전체")
                  .map((genre) => (
                    <ChoiceButton
                      key={genre}
                      selected={selectedGenres.includes(genre)}
                      onClick={() =>
                        setSelectedGenres((prev) =>
                          prev.includes(genre)
                            ? prev.filter((g) => g !== genre)
                            : [...prev, genre]
                        )
                      }
                    >
                      {genre}
                    </ChoiceButton>
                  ))}
              </div>
            </div>

            <div>
              <h3>플랫폼</h3>

              <div className="segmented">
                {platforms
                  .filter((platform) => platform !== "전체")
                  .map((platform) => (
                    <ChoiceButton
                      key={platform}
                      selected={selectedPlatforms.includes(platform)}
                      onClick={() =>
                        setSelectedPlatforms((prev) =>
                          prev.includes(platform)
                            ? prev.filter((p) => p !== platform)
                            : [...prev, platform]
                        )
                      }
                    >
                      {platform}
                    </ChoiceButton>
                  ))}
              </div>
            </div>
          </div>
          <WebtoonGrid webtoons={finalRecommendation} />
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
