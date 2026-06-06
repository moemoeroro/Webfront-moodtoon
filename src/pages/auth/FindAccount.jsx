import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { findUsername, resetPassword } from "../../services/authApi.js";
import "./auth.css";

const initialFindForm = {
  contact: "",
};

const initialResetForm = {
  username: "",
  contact: "",
};

const initialRecoveryForm = {
  password: "",
  passwordConfirm: "",
};

function FindAccount() {
  const [searchParams] = useSearchParams();
  const { completePasswordReset, isPasswordRecovery } = useAuth();
  const [findForm, setFindForm] = useState(initialFindForm);
  const [resetForm, setResetForm] = useState(initialResetForm);
  const [recoveryForm, setRecoveryForm] = useState(initialRecoveryForm);
  const [findResult, setFindResult] = useState(null);
  const [resetResult, setResetResult] = useState(null);
  const [recoveryResult, setRecoveryResult] = useState(null);
  const [loadingType, setLoadingType] = useState("");
  const [activeTab, setActiveTab] = useState(
    searchParams.get("mode") === "recovery" ? "recovery" : "find"
  );

  useEffect(() => {
    if (isPasswordRecovery || searchParams.get("mode") === "recovery") {
      setActiveTab("recovery");
    }
  }, [isPasswordRecovery, searchParams]);

  const handleFindUsername = async (e) => {
    e.preventDefault();
    setFindResult(null);
    setLoadingType("find");

    const result = await findUsername(findForm);
    setLoadingType("");
    setFindResult(result);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetResult(null);
    setLoadingType("reset");

    const result = await resetPassword(resetForm);
    setLoadingType("");
    setResetResult(result);

    if (result.ok) {
      setResetForm(initialResetForm);
    }
  };

  const handleCompletePasswordReset = async (e) => {
    e.preventDefault();
    setRecoveryResult(null);
    setLoadingType("recovery");

    const result = await completePasswordReset(recoveryForm);
    setLoadingType("");
    setRecoveryResult(result);

    if (result.ok) {
      setRecoveryForm(initialRecoveryForm);
    }
  };

  return (
    <div className="page auth-page">
      <section className="card auth-card auth-card-wide">
        <p className="eyebrow">Account</p>
        <h1>계정 찾기</h1>

        <div className="auth-tabs">
          <button
            type="button"
            className={activeTab === "find" ? "active" : ""}
            onClick={() => setActiveTab("find")}
          >
            아이디 찾기
          </button>

          <button
            type="button"
            className={activeTab === "reset" ? "active" : ""}
            onClick={() => setActiveTab("reset")}
          >
            비밀번호 재설정
          </button>

          {activeTab === "recovery" && (
            <button type="button" className="active">
              새 비밀번호
            </button>
          )}
        </div>

        {activeTab === "find" && (
          <form onSubmit={handleFindUsername}>
            <h2>아이디 찾기</h2>

            <label>
              이메일
              <input
                type="email"
                value={findForm.contact}
                onChange={(e) =>
                  setFindForm({ ...findForm, contact: e.target.value })
                }
                required
              />
            </label>

            {findResult && (
              <p className={`form-message ${findResult.ok ? "success" : ""}`}>
                {findResult.ok
                  ? `찾은 아이디: ${findResult.usernames.join(", ")}`
                  : findResult.message}
              </p>
            )}

            <Button shine type="submit" disabled={loadingType === "find"}>
              {loadingType === "find" ? "조회 중..." : "아이디 찾기"}
            </Button>
          </form>
        )}

        {activeTab === "reset" && (
          <form onSubmit={handleResetPassword}>
            <h2>비밀번호 재설정</h2>

            <label>
              아이디
              <input
                autoComplete="username"
                value={resetForm.username}
                onChange={(e) =>
                  setResetForm({ ...resetForm, username: e.target.value })
                }
                required
              />
            </label>
            <label>
              이메일
              <input
                type="email"
                value={resetForm.contact}
                onChange={(e) =>
                  setResetForm({ ...resetForm, contact: e.target.value })
                }
                required
              />
            </label>

            {resetResult && (
              <p className={`form-message ${resetResult.ok ? "success" : ""}`}>
                {resetResult.message}
              </p>
            )}

            <Button shine type="submit" disabled={loadingType === "reset"}>
              {loadingType === "reset" ? "발송 중..." : "재설정 메일 받기"}
            </Button>
          </form>
        )}

        {activeTab === "recovery" && (
          <form onSubmit={handleCompletePasswordReset}>
            <h2>새 비밀번호 설정</h2>

            <label>
              새 비밀번호
              <input
                type="password"
                autoComplete="new-password"
                value={recoveryForm.password}
                minLength="8"
                onChange={(e) =>
                  setRecoveryForm({
                    ...recoveryForm,
                    password: e.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              새 비밀번호 확인
              <input
                type="password"
                autoComplete="new-password"
                value={recoveryForm.passwordConfirm}
                minLength="8"
                onChange={(e) =>
                  setRecoveryForm({
                    ...recoveryForm,
                    passwordConfirm: e.target.value,
                  })
                }
                required
              />
            </label>

            {recoveryResult && (
              <p
                className={`form-message ${
                  recoveryResult.ok ? "success" : ""
                }`}
              >
                {recoveryResult.message}
              </p>
            )}

            <Button shine type="submit" disabled={loadingType === "recovery"}>
              {loadingType === "recovery" ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </form>
        )}

        <p>
          다시 로그인하려면 <Link to="/login">로그인 페이지</Link>
        </p>
      </section>
    </div>
  );
}

export default FindAccount;
