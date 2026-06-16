import { isSupabaseConfigured, supabase } from "./supabaseClient.js";

export async function fetchPopularBookmarkedWebtoons(limit = 6) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, items: [] };
  }

  const { data, error } = await supabase.rpc("get_popular_bookmarked_webtoons", {
    p_limit: limit,
  });

  if (error) {
    return {
      ok: false,
      items: [],
      message: "인기웹툰을 불러오지 못했습니다.",
    };
  }

  return {
    ok: true,
    items: (data || []).map((item) => ({
      bookmarkCount: item.bookmark_count || 0,
      webtoonId: item.webtoon_id,
    })),
  };
}
