import { useMemo, useState } from "react";

function CommentList({ comments }) {
  const [sortType, setSortType] = useState("popular");

  const sortedComments = useMemo(() => {
    const nextComments = [...comments];
    if (sortType === "popular") {
      return nextComments.sort((a, b) => b.empathy - a.empathy);
    }
    return nextComments.sort((a, b) => b.id - a.id);
  }, [comments, sortType]);

  return (
    <section className="comment-section">
      <div className="section-title compact">
        <div>
          <p className="eyebrow">댓글</p>
          <h2>작품 감상</h2>
        </div>
        <div className="segmented small">
          <button
            className={sortType === "popular" ? "selected" : ""}
            onClick={() => setSortType("popular")}
            type="button"
          >
            인기순
          </button>
          <button
            className={sortType === "latest" ? "selected" : ""}
            onClick={() => setSortType("latest")}
            type="button"
          >
            최신순
          </button>
        </div>
      </div>

      <div className="comment-list">
        {sortedComments.map((comment) => (
          <article className="comment-item" key={comment.id}>
            <strong>{comment.user}</strong>
            <p>{comment.text}</p>
            <button type="button">공감 {comment.empathy}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CommentList;

