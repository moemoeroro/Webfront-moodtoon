import { useState } from "react";
import Button from "../ui/Button.jsx";

function CommentForm({ onSubmit }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    // 공백만 입력한 댓글은 등록 방지
    if (!commentText.trim()) return;

    onSubmit(commentText);
    setCommentText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 방지
      handleSubmit();
    }
  };

  return (
    <div className="comment-form">
      <textarea
        placeholder="댓글을 작성해주세요..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button onClick={handleSubmit}>
        댓글 작성
      </Button>
    </div>
  );
}

export default CommentForm;