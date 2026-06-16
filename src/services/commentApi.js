import { supabase } from "./supabaseClient.js";

// DB 댓글 데이터를 화면에서 사용하는 형태로 변환
function toComment(row) {
  return {
    date: row.created_at?.slice(0, 10) || "", // YYYY-MM-DD 형식 날짜
    empathy: row.empathy_count || 0, // 공감 수
    id: row.id, // 댓글 ID
    text: row.text, // 댓글 내용
    user: row.nickname, // 작성자 닉네임
    userId: row.user_id, // 작성자 ID
    webtoonId: row.webtoon_id, // 웹툰 ID
  };
}

// 특정 웹툰의 댓글 목록 조회
export async function fetchComments(webtoonId) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("webtoon_id", webtoonId) // 해당 웹툰 댓글만 조회
    .order("created_at", { ascending: false }); // 최신순 정렬

  if (error) {
    return { ok: false, message: "댓글을 불러오지 못했습니다.", comments: [] };
  }

  return { ok: true, comments: data.map(toComment) }; // 화면용 데이터로 변환
}

// 로그인 사용자가 작성한 댓글 목록 조회
export async function fetchMyComments(userId) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, message: "내 댓글을 불러오지 못했습니다.", comments: [] };
  }

  return { ok: true, comments: data.map(toComment) };
}

// 댓글 작성
export async function createComment({ currentUser, text, webtoonId }) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      nickname: currentUser.nickname, // 작성자 닉네임
      text, // 댓글 내용
      user_id: currentUser.id, // 작성자 ID
      webtoon_id: webtoonId, // 대상 웹툰 ID
    })
    .select("*")
    .single(); // 추가된 댓글 1건 반환

  if (error) {
    return { ok: false, message: `댓글을 저장하지 못했습니다. ${error.message}` };
  }

  return { ok: true, comment: toComment(data) };
}

// 댓글 수정
export async function updateComment(commentId, text) {
  const { data, error } = await supabase
    .from("comments")
    .update({ text }) // 댓글 내용 변경
    .eq("id", commentId)
    .select("*")
    .single();

  if (error) {
    return { ok: false, message: `댓글을 수정하지 못했습니다. ${error.message}` };
  }

  return { ok: true, comment: toComment(data) };
}

// 댓글 삭제
export async function removeComment(commentId) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId); // 댓글 ID 기준 삭제

  if (error) {
    return { ok: false, message: `댓글을 삭제하지 못했습니다. ${error.message}` };
  }

  return { ok: true };
}

/**
 * 댓글 공감(좋아요) 상태 토글
 * Supabase RPC 함수(toggle_comment_like) 호출
 * - 이미 공감한 경우 → 취소
 * - 공감하지 않은 경우 → 추가
 */
export async function toggleCommentLike(commentId) {
  const { data, error } = await supabase.rpc("toggle_comment_like", {
    p_comment_id: commentId,
  });

  if (error) {
    return {
      ok: false,
      message: `공감 상태를 저장하지 못했습니다. ${error.message}`,
    };
  }

  return { ok: true, result: data?.[0] };
}
