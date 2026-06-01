import { Link, useParams } from "react-router-dom";
import { webtoons } from "../../data/mockWebtoons.js";
import { useAuth } from "../../context/AuthContext.jsx";
import CommentList from "../../components/CommentList/CommentList.jsx";
import "./WebtoonDetail.css";


function WebtoonDetail() {
  const { id } = useParams();
  
  const { currentUser, updateProfile } = useAuth();

  const webtoon = webtoons.find(
    (item) => String(item.id) === id
  );

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

  const isBookmarked = currentUser?.likedWebtoonIds.includes(webtoon.id);

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
              <dt>작가명</dt>
              <dd>{webtoon.author}</dd>
            </div>
            <div>
              <dt>장르태그</dt>
              <dd>{webtoon.genre} · {webtoon.tags.join(", ")}</dd>
            </div>
            <div>
              <dt>전체회차</dt>
              <dd>{webtoon.episodes}화</dd>
            </div>
            <div>
              <dt>연재시작일</dt>
              <dd>{webtoon.startYear}년</dd>
            </div>
          </dl>
        </div>
      </section>

      <CommentList
        comments={webtoon.comments}
        webtoonId={webtoon.id}
      />
    </div>
  );
}

export default WebtoonDetail;

