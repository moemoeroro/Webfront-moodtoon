import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(form);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate("/profile");
  };

  return (
    <div className="page auth-page">
      <section className="auth-card">
        <p className="eyebrow">Login</p>
        <h1>무드툰 로그인</h1>
        <form onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              required
            />
          </label>
          {message && <p className="form-message">{message}</p>}
          <button className="primary-button" type="submit">
            로그인
          </button>
        </form>
        <p>
          계정이 없다면 <Link to="/signup">회원가입</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;

