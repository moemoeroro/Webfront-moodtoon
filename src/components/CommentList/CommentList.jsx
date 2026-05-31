import { useMemo, useState } from "react";
import "./CommentList.css";
import ChoiceButton from "../ui/ChoiceButton.jsx";
import CommentItem from "./CommentItem.jsx";
import CommentForm from "./CommentForm.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function CommentList({ comments, webtoonTitle, }) {
  // 댓글 정렬 기준: 'popular' 또는 'latest'
  const [sortType, setSortType] = useState("popular");

  // 댓글 목록 상태, 초기값은 props로 전달받은 comments
  const [commentList, setCommentList] = useState(comments);

  const { currentUser, updateProfile } = useAuth();

  const sortedComments = useMemo(() => {
    const nextComments = [...commentList];

    if (sortType === "popular") {
      return nextComments.sort((a, b) => b.empathy - a.empathy);
    }

    return nextComments.sort((a, b) => b.id - a.id);
  }, [commentList, sortType]);

  // 새로운 댓글 추가 함수
  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now(),
      user: currentUser?.nickname || "익명",
      text,
      empathy: 0,
    };

    setCommentList((prev) => [newComment, ...prev]);

    const profileComment = {
      webtoonTitle,
      text,
      date: new Date().toISOString().slice(0, 10),
    };

    updateProfile({
      comments: [profileComment, ...currentUser.comments],
    });
  };

  return (
    <section className="card comment-section">
      <SectionTitle eyebrow="댓글" title="작품 감상" compact>

        {/* 정렬 선택 버튼 */}
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
      </SectionTitle>

      {/* 댓글 작성 폼 */}
      <CommentForm onSubmit={handleAddComment} />

      {/* 댓글 목록 렌더링 */}
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