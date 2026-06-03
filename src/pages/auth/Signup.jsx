import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import "./auth.css";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const result = await signup(form);
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
        <p className="eyebrow">Signup</p>
        <h1>moodtoon 회원가입</h1>
        <form onSubmit={handleSubmit}>
          <label>
            아이디
            <input
              autoComplete="username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />
          </label>
          <label>
            닉네임
            <input
              value={form.nickname}
              onChange={(e) =>
                setForm({ ...form, nickname: e.target.value })
              }
              required
            />
          </label>
          <label>
            이메일
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              autoComplete="new-password"
              value={form.password}
              minLength="8"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </label>
          <label>
            비밀번호 확인
            <input
              type="password"
              autoComplete="new-password"
              value={form.passwordConfirm}
              minLength="8"
              onChange={(e) =>
                setForm({ ...form, passwordConfirm: e.target.value })
              }
              required
            />
          </label>
          {message && <p className="form-message">{message}</p>}
          <Button shine type="submit" disabled={isSubmitting}>
            {isSubmitting ? "가입 중..." : "가입하기"}
          </Button>
        </form>
        <p>
          이미 계정이 있다면 <Link to="/login">로그인</Link>
        </p>
      </section>
    </div>
  );
}

export default Signup;
