import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
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
  const { currentUser, updateProfile } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null); // 기분
  const [weather, setWeather] = useState(null); // 날씨
  const [recommendation, setRecommendation] = useState(null); // 추천 결과
  const [selectedGenres, setSelectedGenres] = useState([]); // 장르 필터
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); // 플랫폼 필터
  
  // 추천 버튼 함수
  const handleRecommend = async () => {
    
    if (!selectedMood) {
      alert("기분을 선택해 주세요.");
      return;
    }
    
    if (currentUser) {
      await updateProfile({
        moodLogs: [
          ...(currentUser.moodLogs || []),
          {
            mood: selectedMood,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    setSelectedGenres([]);
    setSelectedPlatforms([]);
    
    const result = recommendWebtoons({
      mood: selectedMood || "피곤함",
      weatherType: weather?.type || "cloudy",
    }).filter(w => w.score > 0);;

    setRecommendation({
      items: result, 
      reason: `${weather?.text || "흐림"} 날씨와 '${selectedMood}' 기분을 반영했습니다.`,
    });
  };

  const [showFilters, setShowFilters] = useState(false); // 필터 펼침 여부

  
  // 추천 결과 (장르/플랫폼)
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

  const finalRecommendation = filteredRecommendation.slice(0, 8);

  return (
    <div className="page home-page">
      {/* 메인 소개 영역 */}
      <section className="hero-section">
        <div>
          <h1>오늘의 날씨와 감정에 맞는 웹툰을 추천받아보세요</h1>
          <p>
            moodtoon은 날씨와 현재 감정을 반영해 지금 보기 좋은 웹툰을 추천해줄 수 있습니다!
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
          <div className="recommend-header">
            <SectionTitle
              eyebrow="추천 결과"
              title="오늘의 추천 웹툰 8개"
              description={recommendation.reason}
            />

            <Button
              variant={showFilters ? "primary" : "outline"}
              size="small"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              ☰
            </Button>
          </div>
          <div className={`recommend-filters ${showFilters ? "open" : "hide"}`}>
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

    </div>
  );
}

export default Home;
