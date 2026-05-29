import { genres, platforms } from "../../data/mockWebtoons.js";
import "./FilterPanel.css";

function FilterPanel({ filters, onChange }) {
  return (
    <aside className="card filter-panel">
      <label>
        장르
        <select
          value={filters.genre}
          onChange={(e) => onChange({ ...filters, genre: e.target.value })}
        >
          {genres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
      </label>

      <label>
        플랫폼
        <select
          value={filters.platform}
          onChange={(e) =>
            onChange({ ...filters, platform: e.target.value })
          }
        >
          {platforms.map((platform) => (
            <option key={platform}>{platform}</option>
          ))}
        </select>
      </label>

      <label>
        회차 수
        <select
          value={filters.episodeRange}
          onChange={(e) =>
            onChange({ ...filters, episodeRange: e.target.value })
          }
        >
          <option>전체</option>
          <option>50화 이하</option>
          <option>51화 이상</option>
        </select>
      </label>

      <label>
        연재시작일
        <select
          value={filters.startYear}
          onChange={(e) =>
            onChange({ ...filters, startYear: e.target.value })
          }
        >
          <option>전체</option>
          <option>2025</option>
          <option>2024</option>
          <option>2023 이전</option>
        </select>
      </label>
    </aside>
  );
}

export default FilterPanel;

