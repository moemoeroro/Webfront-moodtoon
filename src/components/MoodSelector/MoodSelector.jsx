import { moods } from "../../data/mockWebtoons.js";
import "./MoodSelector.css";
import ChoiceButton from "../ui/ChoiceButton.jsx";

const moodIcons = {
  행복함: "😊",
  피곤함: "😴",
  우울함: "🌧️",
  스트레스: "🫧",
  설렘: "💗",
  신남: "✨",
  편안함: "🍵",
  차분함: "🌙",
};

// 감정에 맞는 아이콘 반환
function getMoodIcon(mood) {
  return moodIcons[mood] || "☁️";
}

function MoodSelector({ selectedMood, onSelect }) {
  const selectedIcon = getMoodIcon(selectedMood);

  return (
    <section className="summary-card mood-summary">
      <div className="summary-card-top">
        <div>
          <p className="eyebrow">오늘의 기분</p>

          <h2>
            <span
              className="selected-mood-icon"
              aria-hidden="true"
            >
              {selectedIcon}
            </span>

            {selectedMood || "기분을 선택해주세요"}
          </h2>
        </div>
      </div>

      <div className="choice-grid mood-grid">
        {moods.map((mood) => (
          <ChoiceButton
            key={mood}
            selected={selectedMood === mood}
            aria-pressed={selectedMood === mood}
            onClick={() => onSelect(mood)}
            type="button"
          >
            <span
              className="mood-icon"
              aria-hidden="true"
            >
              {getMoodIcon(mood)}
            </span>

            <span>{mood}</span>
          </ChoiceButton>
        ))}
      </div>
    </section>
  );
}

export default MoodSelector;