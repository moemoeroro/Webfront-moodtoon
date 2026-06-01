import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { storage } from "../utils/storage";

const COMMENTS_KEY = "moodtoon_comments";

export function useComments(webtoonId, initialComments, webtoonTitle) {
  const { currentUser, updateProfile } = useAuth();

  const [commentList, setCommentList] = useState(() => {
    const saved = storage.get(COMMENTS_KEY, {});
    return saved[webtoonId] || initialComments;
  });

  // 저장 함수
  const save = (next) => {
    const saved = storage.get(COMMENTS_KEY, {});
    saved[webtoonId] = next;
    storage.set(COMMENTS_KEY, saved);
  };

  // 댓글 추가
  const addComment = (text) => {
    if (!currentUser) return;

    const newComment = {
      id: Date.now(),
      user: currentUser.nickname,
      text,
      empathy: 0,
    };

    const next = [newComment, ...commentList];
    setCommentList(next);
    save(next);

    updateProfile({
      comments: [
        {
          id: newComment.id,
          webtoonId,
          webtoonTitle,
          text,
          date: new Date().toISOString().slice(0, 10),
        },
        ...(currentUser.comments ?? []),
      ],
    });
  };

  const deleteComment = (commentId) => {
    const next = commentList.filter(
      (comment) => comment.id !== commentId
    );

    setCommentList(next);
    save(next);

    updateProfile({
      comments: (currentUser.comments ?? []).filter(
        (comment) => comment.id !== commentId
      ),
    });
  };

  const editComment = (commentId, newText) => {
    const next = commentList.map((comment) =>
      comment.id === commentId
        ? { ...comment, text: newText }
        : comment
    );

    setCommentList(next);
    save(next);

    updateProfile({
      comments: (currentUser.comments ?? []).map(
        (comment) =>
          comment.id === commentId
            ? { ...comment, text: newText }
            : comment
      ),
    });
  };

  // 공감 기능
  const toggleEmpathy = (commentId) => {
    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    // 이미 공감 눌렀는지 확인
    const alreadyLiked =
      currentUser.likedComments?.includes(commentId);

    // 좋아요 토글 처리
    const updatedLikedComments = alreadyLiked
      ? currentUser.likedComments.filter((id) => id !== commentId)
      : [...(currentUser.likedComments || []), commentId];

    // 댓글 empathy 값 증가/감소
    const nextComments = commentList.map((comment) => {
      if (comment.id !== commentId) return comment;

      return {
        ...comment,
        empathy: alreadyLiked
          ? comment.empathy - 1
          : comment.empathy + 1,
      };
    });

    setCommentList(nextComments);
    save(nextComments);

    // 프로필 좋아요 목록 업데이트
    updateProfile({
      likedComments: updatedLikedComments,
    });
  };

  return {
    commentList,
    addComment,
    deleteComment,
    editComment,
    toggleEmpathy,
  };
}