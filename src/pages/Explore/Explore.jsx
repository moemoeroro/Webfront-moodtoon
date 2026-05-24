import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterPanel from "../../components/FilterPanel/FilterPanel.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import WebtoonCard from "../../components/WebtoonCard/WebtoonCard.jsx";
import { searchWebtoons } from "../../services/webtoonApi.js";
import "./Explore.css";

function Explore() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    genre: "전체",
    platform: "전체",
    episodeRange: "전체",
    startYear: "전체",
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    searchWebtoons({
      keyword,
      genre: filters.genre,
      platform: filters.platform,
    }).then(setItems);
  }, [keyword, filters.genre, filters.platform]);

  const filteredItems = useMemo(() => {
    return items.filter((webtoon) => {
      const matchesEpisodes =
        filters.episodeRange === "전체" ||
        (filters.episodeRange === "50화 이하" && webtoon.episodes <= 50) ||
        (filters.episodeRange === "51화 이상" && webtoon.episodes >= 51);

      const matchesYear =
        filters.startYear === "전체" ||
        String(webtoon.startYear) === filters.startYear ||
        (filters.startYear === "2023 이전" && webtoon.startYear <= 2023);

      return matchesEpisodes && matchesYear;
    });
  }, [items, filters.episodeRange, filters.startYear]);

  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">Explore</p>
        <h1>웹툰 탐색</h1>
        <p>작품명, 작가, 태그를 검색하고 장르와 플랫폼 조건으로 좁혀보세요.</p>
      </div>

      <span className="explore-text">통합 검색</span>
      <section className="explore-toolbar">
        <SearchBar keyword={keyword} onKeywordChange={setKeyword} />
        <button
          className="filter-button"
          onClick={() => setShowFilters((prev) => !prev)}
          type="button"
        >
          필터
        </button>
      </section>

      {showFilters && <FilterPanel filters={filters} onChange={setFilters} />}

      <section>
        <div className="section-title compact">
          <div>
            <p className="eyebrow">Search Result</p>
            <h2>{filteredItems.length}개의 웹툰</h2>
          </div>
        </div>
        <div className="webtoon-grid">
          {filteredItems.map((webtoon) => (
            <WebtoonCard key={webtoon.id} webtoon={webtoon} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Explore;

