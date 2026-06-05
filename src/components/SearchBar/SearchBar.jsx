import "./SearchBar.css";

function SearchBar({ keyword, onKeywordChange, onEnter }) {
  return (
    <label className="search-box">
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter();
          }
        }}
        placeholder="작품명, 작가, 태그를 입력하세요"
      />
    </label>
  );
}

export default SearchBar;

