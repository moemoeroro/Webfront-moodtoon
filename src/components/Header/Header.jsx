import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";
import "./Header.css";


function Header() {

  const navigate = useNavigate();

  // 로그인된 사용자 정보 (AuthContext에서 가져옴)
  const { currentUser } = useAuth() || {};

  // 검색 입력값 상태 관리
  const [keyword, setKeyword] = useState("");

  // 검색 폼 제출 시 실행되는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    navigate(`/explore?keyword=${encodeURIComponent(trimmedKeyword)}`);
  };

  return (
    <header className="site-header">

      {/* 로고 클릭 시 홈("/")으로 이동 */}
      <Link className="brand" to="/" aria-label="moodtoon home">
        <span className="brand-mark">m</span>
        <span>moodtoon</span>
      </Link>

       {/* 검색 영역 */}
      <form className="header-search" onSubmit={handleSubmit}>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="작품명, 작가 검색"
        />
        <Button type="submit" variant="primary shine" size="medium">검색</Button>
      </form>
      

      {/* 네비게이션 메뉴 */}
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