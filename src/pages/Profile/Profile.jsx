import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import WebtoonCard from "../../components/WebtoonCard/WebtoonCard.jsx";
import { webtoons } from "../../data/mockWebtoons.js";
import "./Profile.css";
import Button from "../../Components/ui/Button.jsx";

function getTopMood(moodLogs) {
  const counts = moodLogs.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "기록 없음";
}

function Profile() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const likedWebtoons = webtoons.filter((webtoon) =>
    currentUser.likedWebtoonIds.includes(webtoon.id)
  );

  return (
    <div className="page">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{currentUser.nickname}님의 moodtoon</h1>
          <p>이번 주 가장 많이 선택한 감정: {getTopMood(currentUser.moodLogs)}</p>
        </div>
        <Button variant="danger" size="large" onClick={logout} type="button">
          로그아웃
        </Button>
      </section>

      <div className="profile-grid">
        <section className="profile-panel">
          <p className="eyebrow">선호하는 장르</p>
          <div className="tag-row large">
            {currentUser.favoriteGenres.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>
        </section>

        <section className="profile-panel">
          <p className="eyebrow">감정 통계</p>
          <h2>{getTopMood(currentUser.moodLogs)}</h2>
          <p>감정 선택 기록을 기반으로 추천 정확도를 높일 수 있습니다.</p>
        </section>
      </div>

      <section>
        <div className="section-title">
          <p className="eyebrow">좋아요 누른 웹툰</p>
          <h2>관심 작품</h2>
        </div>
        <div className="webtoon-grid">
          {likedWebtoons.map((webtoon) => (
            <WebtoonCard key={webtoon.id} webtoon={webtoon} />
          ))}
        </div>
      </section>

      <section className="profile-panel">
        <div className="section-title compact">
          <div>
            <p className="eyebrow">내가 남긴 댓글</p>
            <h2>최근 댓글</h2>
          </div>
          <Link className="text-link" to="/explore">
            더 둘러보기
          </Link>
        </div>
        <div className="comment-list">
          {currentUser.comments.map((comment) => (
            <article className="comment-item" key={`${comment.webtoonTitle}-${comment.date}`}>
              <strong>{comment.webtoonTitle}</strong>
              <p>{comment.text}</p>
              <span>{comment.date}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;
