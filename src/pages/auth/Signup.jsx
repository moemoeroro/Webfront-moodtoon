import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import "./auth.css";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ nickname: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signup(form);

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
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={form.password}
              minLength="4"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </label>
          {message && <p className="form-message">{message}</p>}
          <Button className="button primary shine" type="submit">
            가입하기
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
