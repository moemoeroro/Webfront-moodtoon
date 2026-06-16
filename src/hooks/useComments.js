import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createComment,
  fetchComments,
  removeComment,
  toggleCommentLike,
  updateComment,
} from "../services/commentApi.js";

export function useComments(webtoonId) {
  const { currentUser, updateProfile } = useAuth();
  const [commentList, setCommentList] = useState([]); // 댓글 목록
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태


  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    fetchComments(webtoonId)
      .then((result) => {
        if (isMounted && result.ok) {
          setCommentList(result.comments);
        }
      })
      .catch(() => {
        alert("댓글을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [webtoonId]);

  // 댓글 작성
  const addComment = async (text) => {
    if (!currentUser) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    const result = await createComment({ currentUser, text, webtoonId });

    if (!result.ok) {
      alert(result.message);
      return;
    }

    setCommentList((comments) => [result.comment, ...comments]);
  };

  // 댓글 삭제
  const deleteComment = async (commentId) => {
    const result = await removeComment(commentId);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    setCommentList((comments) =>
      comments.filter((comment) => comment.id !== commentId)
    );

    updateProfile({
      likedComments:
        currentUser?.likedComments?.filter((id) => id !== commentId) || [],
    });
  };

  // 댓글 수정
  const editComment = async (commentId, newText) => {
    const result = await updateComment(commentId, newText);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    setCommentList((comments) =>
      comments.map((comment) =>
        comment.id === commentId ? result.comment : comment
      )
    );
  };

  // 공감
  const toggleEmpathy = async (commentId) => {
    if (!currentUser) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    const result = await toggleCommentLike(commentId);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    const likedCommentIds = result.result?.liked_comment_ids || [];
    const empathyCount = result.result?.empathy_count || 0;

    setCommentList((comments) =>
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, empathy: empathyCount }
          : comment
      )
    );

    updateProfile({
      likedComments: likedCommentIds,
    });
  };

  return {
    addComment,
    commentList,
    deleteComment,
    editComment,
    isLoading,
    toggleEmpathy,
  };
}
