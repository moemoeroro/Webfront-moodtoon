import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Header() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/explore?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="무드툰 홈으로 이동">
        <span className="brand-mark">M</span>
        <span>무드툰</span>
      </Link>

      <form className="header-search" onSubmit={handleSubmit}>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="작품명, 작가, 태그 검색"
        />
        <button type="submit">검색</button>
      </form>

      <nav className="site-nav" aria-label="주요 메뉴">
        <NavLink to="/">추천</NavLink>
        <NavLink to="/explore">탐색</NavLink>
        {currentUser ? (
          <NavLink to="/profile">프로필</NavLink>
        ) : (
          <NavLink to="/login">로그인</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;

