import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import WebtoonGrid from "../../components/Webtoon/WebtoonGrid.jsx";
import { webtoons } from "../../data/mockWebtoons.js";
import "./Profile.css";
import Button from "../../components/ui/Button.jsx";
import Tag from "../../components/ui/Tag.jsx";
import SectionTitle from "../../components/ui/SectionTitle.jsx";

// 감정 로그에서 가장 많이 선택된 감정 추출
function getTopMood(moodLogs) {
  const counts = moodLogs.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "기록 없음";
}

function Profile() {
  const { currentUser, logout } = useAuth();

  // 로그인하지 않은 사용자는 로그인 페이지로 이동
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const likedWebtoons = webtoons.filter((webtoon) =>
    currentUser.likedWebtoonIds.includes(webtoon.id)
  );

  return (
    <div className="page">
      <section className="card profile-hero">
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
        <section className="card profile-panel">
          <SectionTitle title="선호하는 장르"/>
          <div className="tag-row">
            {currentUser.favoriteGenres.map((genre) => (
              <Tag key={genre} size="large">
                {genre}
              </Tag>
            ))}
          </div>
        </section>

        <section className="card profile-panel">
          <SectionTitle 
            eyebrow="감정 통계"
            title={getTopMood(currentUser.moodLogs)}
          />
          <p>감정 선택 기록을 기반으로 추천 정확도를 높일 수 있습니다.</p>
        </section>
      </div>

      <section>
        <SectionTitle
          title="관심 작품"
        />

        <WebtoonGrid webtoons={likedWebtoons} />
      </section>

      <section className="card profile-panel">
        <SectionTitle
          eyebrow="내가 남긴 댓글"
          title="최근 댓글"
          compact
        >
          <Link className="text-link" to="/explore">
            더 둘러보기
          </Link>
        </SectionTitle>
        <div className="comment-list">
          {currentUser.comments.map((comment) => (
            <Link
              to={`/webtoon/${comment.webtoonId}`}
              className="comment-link"
              key={comment.id}
            >
              <article className="comment-item">
                <strong>{comment.webtoonTitle}</strong>
                <p>{comment.text}</p>
                <span>{comment.date}</span>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;
