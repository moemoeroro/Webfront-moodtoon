import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const result = await login(form);
    setIsSubmitting(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate("/profile");
  };

  return (
    <div className="page auth-page">
      <section className="card auth-card">
        <p className="eyebrow">Login</p>
        <h1>moodtoon 로그인</h1>
        <form onSubmit={handleSubmit}>
          <label>
            아이디 또는 이메일
            <input
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={form.password}
              autoComplete="current-password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </label>
          {message && <p className="form-message">{message}</p>}
          <Button shine type="submit" disabled={isSubmitting}>
            {isSubmitting ? "확인 중..." : "로그인"}
          </Button>
        </form>
        <div className="auth-links">
          <Link to="/find-account">아이디/비밀번호 찾기</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </section>
    </div>
  );
}

export default Login;
