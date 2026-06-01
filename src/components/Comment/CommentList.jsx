import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useComments } from "../../hooks/useComments.js";
import ChoiceButton from "../ui/ChoiceButton.jsx";
import CommentItem from "./CommentItem.jsx";
import CommentForm from "./CommentForm.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import "./CommentList.css";

function CommentList({ comments, webtoonId, }) {

  // 댓글 정렬 기준 (popular = 인기순 / latest = 최신순)
  const [sortType, setSortType] = useState("popular");

  // 로그인 사용자 정보 업데이트 함수
  const { currentUser } = useAuth();

  const {
    commentList,
    addComment,
    deleteComment,
    editComment,
    toggleEmpathy
  } = useComments(webtoonId, comments);

  // 정렬 기준에 따라 댓글 목록 정렬
  const sortedComments = useMemo(() => {
    const nextComments = [...commentList];

    // 인기순
    if (sortType === "popular") {
      return nextComments.sort((a, b) => b.empathy - a.empathy);
    }

    // 최신순: id 기준 (시간 기반)
    return nextComments.sort((a, b) => b.id - a.id);
  }, [commentList, sortType]);


  

  return (
    <section className="card comment-section">
      <SectionTitle eyebrow="댓글" title="작품 감상" compact>

        {/* 댓글 정렬 방식 선택 */}
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
      <CommentForm onSubmit={addComment} />

      {/* 댓글 목록 렌더링 */}
      <div className="comment-list">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={deleteComment}
            onEdit={editComment}
            onEmpathy={toggleEmpathy}
            isLiked={currentUser?.likedComments?.includes(comment.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default CommentList;