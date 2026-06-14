import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { fetchWebtoonById } from "../../services/webtoonApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyComments } from "../../services/commentApi.js";
import WebtoonGrid from "../../components/Webtoon/WebtoonGrid.jsx";
import CommentItem from "../../components/Comment/CommentItem.jsx";
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
  const [likedWebtoons, setLikedWebtoons] = useState([]);
  const [myComments, setMyComments] = useState([]); // 내 댓글 저장
  const [isCommentsLoading, setIsCommentsLoading] = useState(false); // 댓글 로딩 상태

  // 북마크 웹툰 로딩
  useEffect(() => {
    if (!currentUser?.id) {
      setLikedWebtoons([]);
      return;
    }

    let ignore = false;

    Promise.all(
      (currentUser.likedWebtoonIds || []).map((id) =>
        fetchWebtoonById(id)
      )
    ).then((data) => {
      if (!ignore) {
        setLikedWebtoons(data.filter(Boolean));
      }
    });

    return () => {
      ignore = true;
    };
  }, [currentUser?.likedWebtoonIds]);

  // 댓글 로딩
  useEffect(() => {
    if (!currentUser?.id) {
      setMyComments([]);
      return;
    }

    let ignore = false;

    setIsCommentsLoading(true);

    fetchMyComments(currentUser.id)
      .then((result) => {
        if (!ignore && result.ok) {
          setMyComments(result.comments);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsCommentsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentUser?.id]);

  // 로그인 체크
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 북마크한 웹툰의 장르 집계
  const genreCounts = likedWebtoons.reduce((acc, webtoon) => {
    acc[webtoon.genre] = (acc[webtoon.genre] || 0) + 1;
    return acc;
  }, {});

  // 장르 순위
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);



  // 감정 통계
  const moodCounts = (currentUser.moodLogs || []).reduce((acc, log) => {
    const mood =
      typeof log === "string"
        ? log
        : log.mood;

    acc[mood] = (acc[mood] || 0) + 1;

    return acc;
  }, {});

  // 상위 3개 감정
  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // 가장 큰 감정 찾기
  const maxCount = Math.max(
    ...topMoods.map(([, count]) => count),
    1
  );

  // 댓글의 웹툰 id 찾기
  const webtoonMap = new Map(
    likedWebtoons.map((w) => [w.id, w])
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
          <div className="profile-tag">
            {topGenres.length === 0 ? (
              <p>북마크한 작품이 없습니다.</p>
            ) : (
              topGenres.map(([genre, count], index) => (
                <div key={genre} size="large">
                  {index + 1}위 {genre} ({count})
                </div>
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

      <section className="interested-webtoons">
        <SectionTitle title="관심 작품"/>
        <WebtoonGrid webtoons={likedWebtoons} />
      </section>

      <section className="card profile-panel">
        <SectionTitle
          eyebrow="내가 남긴 댓글"
          title="최근 댓글"
          compact
        >
        </SectionTitle>
        <div className="comment-list">
          {isCommentsLoading ? (
            <p>댓글을 불러오는 중입니다.</p>
          ) : myComments.length === 0 ? (
            <p>작성한 댓글이 없습니다.</p>
          ) : (
            myComments.map((comment) => {

              return (
                <Link
                  to={`/webtoon/${comment.webtoonId}`}
                  className="comment-link"
                  key={comment.id}
                >
                  <CommentItem
                    comment={comment}
                    title={webtoonMap.get(comment.webtoonId)?.title}
                  />
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
