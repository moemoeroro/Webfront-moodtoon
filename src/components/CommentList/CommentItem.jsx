import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";

function CommentItem({ comment, onDelete, onEdit, onEmpathy, isLiked, }) {
  const { currentUser } = useAuth();

  // 댓글 주정 모드 여부
  const [isEditing, setIsEditing] = useState(false);
  
  // 수정 중인 댓글 내용
  const [editText, setEditText] = useState(comment.text);
  
  return (
    <article className="comment-item">
      {/* 작성자 표시 */}
      <div className="comment-header">
        <strong>{comment.user}</strong>

        <div className="comment-actions">
          {comment.user === currentUser?.nickname && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
            >
              수정
            </button>
          )}

          {comment.user === currentUser?.nickname && !isEditing && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {/* 수정 모드일 경우 textarea 표시 */}
      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      ) : (
        // 일반 모드일 경우 댓글 내용 표시
        <p>{comment.text}</p>
      )}

      {/* 공감 수 표시 버튼 */}
      {!isEditing && (
        <Button
          variant={isLiked ? "primary" : "outline"}
          size="medium"
          type="button"
          onClick={() => onEmpathy(comment.id)}
        >
          {isLiked ? "♥ 공감" : "♡ 공감"} {comment.empathy}
        </Button>
      )}



      {/* 수정 모드일 때 저장 버튼 표시 */}
      {isEditing && (
        <div className="comment-save">
          <button
            type="button"
            onClick={() => {
              if (!editText.trim()) return;

              onEdit(comment.id, editText);
              setIsEditing(false);
            }}
          >
            저장
          </button>
        </div>
      )}
    </article>
  );
}

export default CommentItem;