import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchWebtoonById } from "../../services/webtoonApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import CommentList from "../../components/Comment/CommentList.jsx";
import "./WebtoonDetail.css";



function WebtoonDetail() {
  
  const { id } = useParams();

  // 웹툰 정보를 저장할 상태
  const [webtoon, setWebtoon] = useState(null);

  // 로딩 상태 저장
  const [loading, setLoading] = useState(true);
  
  // 로그인한 사용자 정보와 프로필 수정 함수 가져오기
  const { currentUser, updateProfile } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);

      const data = await fetchWebtoonById(id);

      setWebtoon(data);
      setLoading(false);
    }

    load();
  }, [id]); // id가 바뀌면 다시 실행

  // 로딩 중일 때 화면
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 웹툰을 찾지 못했을 때
  if (!webtoon) {
    return (
      <div className="page empty-page">
        <h1>작품을 찾을 수 없습니다.</h1>
        <Link className="primary-button" to="/explore">
          탐색으로 이동
        </Link>
      </div>
    );
  }

  // 현재 웹툰이 북마크되어 있는지 확인
  const isBookmarked = currentUser?.likedWebtoonIds.includes(webtoon.id);

  // 북마크 버튼 클릭 시 실행
  const handleBookmark = () => {
    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    const updatedIds = isBookmarked
      ? currentUser.likedWebtoonIds.filter(
          (id) => id !== webtoon.id
        )
      : [...currentUser.likedWebtoonIds, webtoon.id];

    updateProfile({
      likedWebtoonIds: updatedIds,
    });
  };

  return (
    <div className="page">
      <section className="detail-layout">
        <img className="detail-cover" src={webtoon.image} alt={`${webtoon.title} 표지`} />
        <div className="card detail-info">
          <p className="eyebrow">{webtoon.platform}</p>
          <h1>{webtoon.title}</h1>
          <p>{webtoon.description}</p>

          <button
            className="bookmark-button"
            onClick={handleBookmark}
          >
            {isBookmarked ? "★ 북마크됨" : "☆ 북마크"}
          </button>

          <dl className="info-list">
            <div>
              <dt>글/그림 작가</dt>
              <dd>{webtoon.sntncWritrNm} · {webtoon.pictrWritrNm}</dd>
            </div>
            <div>
              <dt>장르</dt>
              <dd>{webtoon.genre}</dd>
            </div>
          </dl>
        </div>
      </section>

      <CommentList
        webtoonId={webtoon.id}
      />
    </div>
  );
}

export default WebtoonDetail;

