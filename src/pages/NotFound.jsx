import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page empty-page">
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link className="primary-button" to="/">
        홈으로 이동
      </Link>
    </div>
  );
}

export default NotFound;

