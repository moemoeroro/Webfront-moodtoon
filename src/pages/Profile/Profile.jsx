import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { webtoons } from "../../data/mockWebtoons.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyComments } from "../../services/commentApi.js";
import WebtoonGrid from "../../components/Webtoon/WebtoonGrid.jsx";
import Button from "../../components/ui/Button.jsx";
import Tag from "../../components/ui/Tag.jsx";
import SectionTitle from "../../components/ui/SectionTitle.jsx";
import "./Profile.css";

// 감정 로그에서 가장 많이 선택된 감정 추출
function getTopMood(moodLogs = []) {
  const counts = moodLogs.reduce((acc, log) => {
    const mood =
      typeof log === "string"
        ? log
        : log.mood;

    acc[mood] = (acc[mood] || 0) + 1;

    return acc;
  }, {});

  return (
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "기록 없음"
  );
}

function Profile() {
  const { currentUser, isLoading, logout } = useAuth();
  const [myComments, setMyComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!currentUser?.id) {
      setMyComments([]);
      return;
    }

    setIsCommentsLoading(true);

    fetchMyComments(currentUser.id)
      .then((result) => {
        if (isMounted && result.ok) {
          setMyComments(result.comments);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCommentsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  // 로그인하지 않은 사용자는 로그인 페이지로 이동
  if (isLoading) {
    return (
      <div className="page empty-page">
        <h1>프로필을 불러오는 중입니다.</h1>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const likedWebtoons = webtoons.filter((webtoon) =>
    currentUser.likedWebtoonIds.includes(webtoon.id)
  );

  // 북마크한 웹툰의 장르 집계
  const genreCounts = likedWebtoons.reduce((acc, webtoon) => {
    acc[webtoon.genre] = (acc[webtoon.genre] || 0) + 1;
    return acc;
  }, {});

  // 많이 북마크한 순으로 정렬
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1]);

  const moodCounts = (currentUser.moodLogs || []).reduce((acc, log) => {
    const mood =
      typeof log === "string"
        ? log
        : log.mood;

    acc[mood] = (acc[mood] || 0) + 1;

    return acc;
  }, {});

  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxCount = Math.max(
    ...topMoods.map(([, count]) => count),
    1
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
            {topGenres.length === 0 ? (
              <p>북마크한 작품이 없습니다.</p>
            ) : (
              topGenres.map(([genre, count], index) => (
                <Tag key={genre} size="large">
                  {index + 1}위 {genre} ({count})
                </Tag>
              ))
            )}
          </div>
        </section>

        <section className="card profile-panel">
          <SectionTitle title="감정 통계" />

          {Object.keys(moodCounts).length === 0 ? (
            <p>아직 감정 기록이 없습니다.</p>
          ) : (
            <div className="mood-chart">
              {topMoods.map(
                ([mood, count]) => (
                  <div
                    key={mood}
                    className="mood-bar-row"
                  >
                    <span>{mood}</span>

                    <div className="mood-bar-track">
                      <div
                        className="mood-bar-fill"
                        style={{
                          width: `${
                            (count / maxCount) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <strong>{count}회</strong>
                  </div>
                )
              )}
            </div>
          )}
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
          {isCommentsLoading ? (
            <p>댓글을 불러오는 중입니다.</p>
          ) : myComments.length === 0 ? (
            <p>작성한 댓글이 없습니다.</p>
          ) : (
            myComments.map((comment) => {
              const webtoon = webtoons.find(
                (item) => item.id === comment.webtoonId
              );

              return (
                <Link
                  to={`/webtoon/${comment.webtoonId}`}
                  className="comment-link"
                  key={comment.id}
                >
                  <article className="comment-item">
                    <strong>{webtoon?.title}</strong>
                    <p>{comment.text}</p>
                    <span>{comment.date}</span>
                  </article>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;
