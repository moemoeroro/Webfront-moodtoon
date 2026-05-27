import { useMemo, useState } from "react";
import "./CommentList.css";

import ChoiceButton from "../ui/ChoiceButton.jsx";

import CommentItem from "./CommentItem.jsx";
import CommentForm from "./CommentForm.jsx";

function CommentList({ comments }) {
  const [sortType, setSortType] = useState("popular");

  const [commentList, setCommentList] = useState(comments);

  const sortedComments = useMemo(() => {
    const nextComments = [...commentList];

    if (sortType === "popular") {
      return nextComments.sort((a, b) => b.empathy - a.empathy);
    }

    return nextComments.sort((a, b) => b.id - a.id);
  }, [commentList, sortType]);

  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now(),
      user: "익명",
      text,
      empathy: 0,
    };

    setCommentList((prev) => [newComment, ...prev]);
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

      <CommentForm onSubmit={handleAddComment} />

      <div className="comment-list">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
          />
        ))}
      </div>
    </section>
  );
}

export default CommentList;