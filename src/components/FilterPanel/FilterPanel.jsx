import { genres, platforms } from "../../data/mockWebtoons.js";
import "./FilterPanel.css";

function FilterPanel({ filters, onChange }) {
  return (
    <aside className="card filter-panel">
      <label>
        장르
        <select
          value={filters.genre}
          onChange={(e) =>
            onChange({ ...filters, genre: e.target.value })
          }
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
    </aside>
  );
}

export default FilterPanel;