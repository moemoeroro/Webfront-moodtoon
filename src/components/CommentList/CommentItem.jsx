function CommentItem({ comment }) {
  return (
    <article className="comment-item">
      <strong>{comment.user}</strong>

      <p>{comment.text}</p>

      <button
        className="button outline medium"
        type="button"
      >
        공감 {comment.empathy}
      </button>
    </article>
  );
}

export default CommentItem;