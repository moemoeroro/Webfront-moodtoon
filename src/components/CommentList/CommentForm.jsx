import { useState } from "react";
import Button from "../ui/Button.jsx";

function CommentForm({ onSubmit }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    onSubmit(commentText);
    setCommentText("");
  };

  return (
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
  );
}

export default CommentForm;