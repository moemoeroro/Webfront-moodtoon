import { supabase } from "./supabaseClient.js";

function toComment(row) {
  return {
    date: row.created_at?.slice(0, 10) || "",
    empathy: row.empathy_count || 0,
    id: row.id,
    text: row.text,
    user: row.nickname,
    userId: row.user_id,
    webtoonId: row.webtoon_id,
  };
}

export async function fetchComments(webtoonId) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("webtoon_id", webtoonId)
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, message: "댓글을 불러오지 못했습니다.", comments: [] };
  }

  return { ok: true, comments: data.map(toComment) };
}

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

export async function createComment({ currentUser, text, webtoonId }) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      nickname: currentUser.nickname,
      text,
      user_id: currentUser.id,
      webtoon_id: webtoonId,
    })
    .select("*")
    .single();

  if (error) {
    return { ok: false, message: `댓글을 저장하지 못했습니다. ${error.message}` };
  }

  return { ok: true, comment: toComment(data) };
}

export async function updateComment(commentId, text) {
  const { data, error } = await supabase
    .from("comments")
    .update({ text })
    .eq("id", commentId)
    .select("*")
    .single();

  if (error) {
    return { ok: false, message: `댓글을 수정하지 못했습니다. ${error.message}` };
  }

  return { ok: true, comment: toComment(data) };
}

export async function removeComment(commentId) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    return { ok: false, message: `댓글을 삭제하지 못했습니다. ${error.message}` };
  }

  return { ok: true };
}

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
