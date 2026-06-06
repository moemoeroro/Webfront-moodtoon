# Webfront moodtoon

감정과 취향에 맞는 웹툰을 추천하고, 로그인한 사용자가 북마크와 감정 기록을 관리할 수 있는 React 기반 웹앱입니다.

## 실행

```bash
npm install
npm run dev
```

## Supabase Auth 설정

1. Supabase 프로젝트를 만듭니다.
2. Supabase SQL editor에서 `supabase/schema.sql`을 실행합니다.
3. `.env.example`을 `.env`로 복사한 뒤 값을 채웁니다.

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4. Supabase Auth URL settings에 로컬 사이트 URL을 추가합니다.

```text
http://127.0.0.1:5173
```

비밀번호 재설정 링크는 앱의 `/find-account?mode=recovery`로 돌아오도록 구성되어 있습니다.

## 주요 기능

- React Router 기반 SPA
- Supabase Auth 기반 로그인, 회원가입, 로그아웃
- Supabase `profiles` 테이블 기반 사용자 프로필/북마크/감정 기록 저장
- Supabase `comments`, `comment_likes` 테이블 기반 댓글/공감 저장
- 아이디 찾기 및 이메일 기반 비밀번호 재설정
- 감정 선택 기반 웹툰 추천
- 웹툰 검색, 필터, 상세 페이지, 댓글 UI
