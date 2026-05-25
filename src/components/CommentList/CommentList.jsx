import { useMemo, useState } from "react";
import "./CommentList.css";
import ChoiceButton from "../ui/ChoiceButton.jsx";
import Button from "../ui/Button.jsx";

function CommentList({ comments }) {
  const [sortType, setSortType] = useState("popular");

  // 새 댓글 입력 상태
  const [commentText, setCommentText] = useState("");

  // 댓글 목록 상태
  const [commentList, setCommentList] = useState(comments);

  const sortedComments = useMemo(() => {
    const nextComments = [...commentList];

    if (sortType === "popular") {
      return nextComments.sort((a, b) => b.empathy - a.empathy);
    }

    return nextComments.sort((a, b) => b.id - a.id);
  }, [commentList, sortType]);

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "익명",
      text: commentText,
      empathy: 0,
    };

    setCommentList((prev) => [newComment, ...prev]);
    setCommentText("");
  };

  return (
    <section className="comment-section">
      <div className="section-title compact">
        <div>
          <p className="eyebrow">댓글</p>
          <h2>작품 감상</h2>
        </div>

        <div className="segmented">
          <ChoiceButton
            selected={sortType === "popular"}
            onClick={() => setSortType("popular")}
          >
            인기순
          </ChoiceButton>

          <ChoiceButton
            selected={sortType === "latest"}
            onClick={() => setSortType("latest")}
          >
            최신순
          </ChoiceButton>
        </div>
      </div>

      {/* 댓글 작성 */}
      <div className="comment-form">
        <textarea
          placeholder="댓글을 작성해주세요..."
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
        />

        <Button onClick={handleSubmit}>
          댓글 작성
        </Button>
      </div>

      <div className="comment-list">
        {sortedComments.map((comment) => (
          <article className="comment-item" key={comment.id}>
            <strong>{comment.user}</strong>

            <p>{comment.text}</p>

            <button
              className="button outline medium"
              type="button"
            >
              공감 {comment.empathy}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CommentList;