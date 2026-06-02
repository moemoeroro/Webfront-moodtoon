import { Link } from "react-router-dom";
import Tag from "../ui/Tag.jsx";
import "./WebtoonCard.css";

function WebtoonCard({ webtoon }) {
  return (
    <article className="webtoon-card">
      <Link to={`/webtoon/${webtoon.id}`}>
        <img src={webtoon.image} alt={`${webtoon.title} 표지`} />
        <div className="webtoon-card-body">
          <div className="card-meta">
            <span>{webtoon.platform}</span>
            <span>{webtoon.episodes}화</span>
          </div>
          <h3>{webtoon.title}</h3>
          <p>{webtoon.author}</p>
          <div className="tag-row">
            {webtoon.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} hasHash={true}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default WebtoonCard;

