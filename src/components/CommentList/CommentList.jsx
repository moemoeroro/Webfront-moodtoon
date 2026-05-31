import { useEffect, useMemo, useState } from "react";
import "./CommentList.css";
import ChoiceButton from "../ui/ChoiceButton.jsx";
import CommentItem from "./CommentItem.jsx";
import CommentForm from "./CommentForm.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function CommentList({ comments, webtoonTitle, webtoonId, }) {

  // 댓글 정렬 기준 (popular/latest)
  const [sortType, setSortType] = useState("popular");

  // 댓글 목록 상태
  const [commentList, setCommentList] = useState(comments);

  // 로그인 사용자 정보 및 프로필 업데이트 함수
  const { currentUser, updateProfile } = useAuth();

  // 정렬 기준에 따라 댓글 목록 정렬
  const sortedComments = useMemo(() => {
    const nextComments = [...commentList];

    if (sortType === "popular") {
      return nextComments.sort((a, b) => b.empathy - a.empathy);
    }

    return nextComments.sort((a, b) => b.id - a.id);
  }, [commentList, sortType]);


  // 새로운 댓글 추가 함수
  const handleAddComment = (text) => {
    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    const newComment = {
      id: Date.now(),
      user: currentUser.nickname,
      text,
      empathy: 0,
    };

    setCommentList((prev) => [newComment, ...prev]);

    // WebtoonDetail 페이지 댓글 목록에 추가
    const profileComment = {
      id: newComment.id,
      webtoonId,
      webtoonTitle,
      text,
      date: new Date().toISOString().slice(0, 10),
    };

    // Profile 페이지 댓글 목록에 추가
    updateProfile({
      comments: [
        profileComment,
        ...(currentUser.comments ?? []),
      ],
    });
  };

  // 댓글 삭제 함수
  const handleDeleteComment = (commentId) => {
    // WebtoonDetail 페이지 댓글 목록 삭제
    setCommentList((prev) =>
      prev.filter((comment) => comment.id !== commentId)
    );

    // Profile 페이지 댓글 목록 삭제
    updateProfile({
      comments: (currentUser.comments ?? []).filter(
        (comment) => comment.id !== commentId
      ),
    });
  };

  // 댓글 수정 함수
  const handleEditComment = (commentId, newText) => {
    // WebtoonDetail 페이지 댓글 수정
    setCommentList((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, text: newText }
          : comment
      )
    );

    // Profile 페이지 댓글 목록 수정
    updateProfile({
      comments: (currentUser.comments ?? []).map((comment) =>
        comment.id === commentId
          ? { ...comment, text: newText }
          : comment
      ),
    });
  };

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
      <CommentForm onSubmit={handleAddComment} />

      {/* 댓글 목록 렌더링 */}
      <div className="comment-list">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}
      </div>
    </section>
  );
}

export default CommentList;