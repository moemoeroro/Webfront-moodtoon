import "./SearchBar.css";

function SearchBar({ keyword, onKeywordChange }) {
  return (
    <label className="search-box">
      <input
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        placeholder="작품명, 작가, 태그를 입력하세요"
      />
    </label>
  );
}

export default SearchBar;

