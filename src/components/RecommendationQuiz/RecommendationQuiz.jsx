import { useState } from "react";
import { genres, platforms } from "../../data/mockWebtoons.js"; // 웹툰 장르 데이터 가져오기
import { recommendWebtoons } from "../../services/webtoonApi.js"; // 웹툰 추천 함수
import "./RecommendationQuiz.css";
import ChoiceButton from "../ui/ChoiceButton.jsx";
import Button from "../ui/Button.jsx";

function RecommendationQuiz({ mood, weather, onResult }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const toggleGenre = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((item) => item !== genre)
        : [...prevGenres, genre]
    );
  };

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prevPlatforms) =>
      prevPlatforms.includes(platform)
        ? prevPlatforms.filter((item) => item !== platform)
        : [...prevPlatforms, platform]
    );
  };

  const handleRecommend = () => {
    const result = recommendWebtoons({
      mood: mood || "피곤함",
      weatherType: weather?.type || "cloudy",
      preferredGenres: selectedGenres,
      preferredPlatforms: selectedPlatforms,
    });

    onResult({
      items: result,
      reason: `${weather?.text || "흐림"} 날씨와 '${mood || "피곤함"}' 기분, ${selectedGenres.join(", ")} 장르 취향을 함께 반영했습니다.`,
    });
  };

  return (
    <section className="quiz-section">
      <div className="section-title">
        <p className="eyebrow">추천받기</p>
        <h2>몇 가지 선택으로 오늘의 웹툰을 골라보세요</h2>
      </div>

      <div className="card quiz-panel">
        <div>
          <h3>선호하는 장르</h3>
          <div className="choice-grid">
            {genres
              .filter((genre) => genre !== "전체")
              .map((genre) => (
                <ChoiceButton
                  key={genre}
                  selected={selectedGenres.includes(genre)}
                  onClick={() => toggleGenre(genre)}
                  type="button"
                >
                  {genre}
                </ChoiceButton>
              ))}
          </div>
        </div>

        <div>
          <h3>플랫폼</h3>
          <div className="segmented">
            {platforms.filter((platform) => platform !== "전체").map((item) => (
              <ChoiceButton
                key={item}
                selected={selectedPlatforms.includes(item)}
                onClick={() => togglePlatform(item)}
                type="button"
              >
                {item}
              </ChoiceButton>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="large"
          shine
          onClick={handleRecommend}
          type="button">
          추천받기
        </Button>
      </div>
    </section>
  );
}

export default RecommendationQuiz;

