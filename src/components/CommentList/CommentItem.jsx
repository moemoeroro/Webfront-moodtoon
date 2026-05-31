import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";

function CommentItem({ comment, onDelete, onEdit, }) {
  const { currentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  
  return (
    <article className="comment-item">
      <strong>{comment.user}</strong>

      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      ) : (
        <p>{comment.text}</p>
      )}

      <Button
        variant="outline"
        size="medium"
        type="button"
      >
        공감 {comment.empathy}
      </Button>

      {comment.user === currentUser?.nickname && !isEditing && (
        <Button
          variant="outline"
          size="medium"
          onClick={() => setIsEditing(true)}
        >
          수정
        </Button>
      )}

      {isEditing && (
        <Button
          variant="primary"
          size="medium"
          onClick={() => {
            if (!editText.trim()) return;

            onEdit(comment.id, editText);
            setIsEditing(false);
          }}
        >
          저장
        </Button>
      )}
      
      {comment.user === currentUser?.nickname && (
        <Button
          variant="danger"
          size="medium"
          onClick={() => onDelete(comment.id)}
        >
          삭제
        </Button>
      )}
    </article>
  );
}

export default CommentItem;