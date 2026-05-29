import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";
import Button from "../ui/Button.jsx";

function Header() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // 검색 입력값 상태
  const [keyword, setKeyword] = useState("");

  // 검색함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    navigate(`/explore?keyword=${encodeURIComponent(trimmedKeyword)}`);
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="moodtoon home">
        <span className="brand-mark">m</span>
        <span>moodtoon</span>
      </Link>

      <form className="header-search" onSubmit={handleSubmit}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="작품명, 작가, 태그 검색"
        />
        <Button type="submit" variant="primary shine" size="medium">검색</Button>
      </form>
      

      <nav className="site-nav" aria-label="주요 메뉴">
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

