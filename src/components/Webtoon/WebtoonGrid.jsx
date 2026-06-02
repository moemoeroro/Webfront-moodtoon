import WebtoonCard from "./WebtoonCard.jsx";
import "./WebtoonGrid.css";

function WebtoonGrid({ webtoons }) {
  if (webtoons.length === 0) {
    return (
      <p className="empty-message">
        표시할 웹툰이 없습니다.
      </p>
    );
  }

  return (
    <div className="webtoon-grid">
      {webtoons.map((webtoon) => (
        <WebtoonCard
          key={webtoon.id}
          webtoon={webtoon}
        />
      ))}
    </div>
  );
}

export default WebtoonGrid;