import { moods } from "../data/mockWebtoons.js";

function MoodSelector({ selectedMood, onSelect }) {
  return (
    <section className="summary-card">
      <p className="eyebrow">오늘의 기분</p>
      <h2>{selectedMood || "기분을 선택해주세요"}</h2>
      <div className="choice-grid">
        {moods.map((mood) => (
          <button
            key={mood}
            className={selectedMood === mood ? "selected" : ""}
            onClick={() => onSelect(mood)}
            type="button"
          >
            {mood}
          </button>
        ))}
      </div>
    </section>
  );
}

export default MoodSelector;

