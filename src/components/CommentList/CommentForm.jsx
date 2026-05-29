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

  return (
    <div className="comment-form">
      <textarea
        placeholder="댓글을 작성해주세요..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />

      <Button onClick={handleSubmit}>
        댓글 작성
      </Button>
    </div>
  );
}

export default CommentForm;