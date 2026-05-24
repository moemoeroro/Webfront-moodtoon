import "./Button.css";

/* variant 
primary: 가장 중요한 행동 - 검색, 추천받기, 로그인, 회원가입
outline: 덜 중요한 행동 - 취소, 필터, 닫기
danger: 위험행동 - 삭제, 댓글 제거
icon: 아이콘 전용 버튼
floating: 둥둥 떠 있는 버튼 - 맨 위로


특수효과
shine: 반짝이
*/
function Button({
  children,
  variant = "primary",
  size = "medium",
  shine = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        button
        ${variant}
        ${size}
        ${shine ? "shine" : ""}
        ${fullWidth ? "full-width" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;