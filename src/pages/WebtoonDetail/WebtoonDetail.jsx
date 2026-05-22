import { Link, useParams } from "react-router-dom";
import CommentList from "../../components/CommentList/CommentList.jsx";
import { webtoons } from "../../data/mockWebtoons.js";
import "./WebtoonDetail.css";

function WebtoonDetail() {
  const { id } = useParams();
  const webtoon = webtoons.find((item) => item.id === id);

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

  return (
    <div className="page">
      <section className="detail-layout">
        <img className="detail-cover" src={webtoon.image} alt={`${webtoon.title} 표지`} />
        <div className="detail-info">
          <p className="eyebrow">{webtoon.platform}</p>
          <h1>{webtoon.title}</h1>
          <p>{webtoon.description}</p>

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

      <CommentList comments={webtoon.comments} />
    </div>
  );
}

export default WebtoonDetail;

