import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchWebtoons } from "../../services/webtoonApi.js";
import FilterPanel from "../../components/FilterPanel/FilterPanel.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import WebtoonGrid from "../../components/Webtoon/WebtoonGrid.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionTitle from "../../components/ui/SectionTitle.jsx";
import "./Explore.css";

function Explore() {
  const [searchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("keyword") || "");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");

  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";

    setInputValue(urlKeyword);
    setKeyword(urlKeyword);
  }, [searchParams]);

  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    genre: "전체",
    platform: "전체",
  });

  const [items, setItems] = useState([]);

  const filteredItems = useMemo(() => {
    return items;
  }, [items]);

  useEffect(() => {
    if (!keyword.trim()) {
      setItems([]);
      return;
    }
    
    let ignore = false;

    setLoading(true);  
    setItems([]);

    searchWebtoons({
      keyword,
      genre: filters.genre,
      platform: filters.platform,
    }).then((data) => {
      if (!ignore) setItems(data);
    }).finally(() => {
      if (!ignore) setLoading(false);  
    });

    return () => {
      ignore = true;
    };
  }, [keyword, filters.genre, filters.platform]);

  return (
    <div className="page">
      <div className="card page-heading">
        <p className="eyebrow">Explore</p>
        <h1>웹툰 탐색</h1>
        <p>작품명, 작가를 검색하고 장르와 플랫폼 필터로 원하는 웹툰을 찾아보세요.</p>
      </div>

      <SectionTitle title="통합 검색" />

      <section className="explore-toolbar">
        <SearchBar
          keyword={inputValue}
          onKeywordChange={setInputValue}
          onEnter={() => setKeyword(inputValue)}
        />

        <Button
          variant="outline"
          size="medium"
          onClick={() => setShowFilters((prev) => !prev)}
          type="button"
        >
          필터
        </Button>
      </section>

      {showFilters && (
        <FilterPanel filters={filters} onChange={setFilters} />
      )}

      <section>
        <SectionTitle
          eyebrow="Search Result"
          title={
            loading
              ? "검색 중..."
              : `${filteredItems.length}개의 웹툰`
          }
          compact
        />

        {loading && items.length === 0 ? (
          <p className="loading">검색 중...</p>
        ) : (
          <WebtoonGrid webtoons={filteredItems} />
        )}
      </section>
    </div>
  );
}

export default Explore;