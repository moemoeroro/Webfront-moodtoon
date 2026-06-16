import { useEffect, useReducer } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { findUsername, resetPassword } from "../../services/authApi.js";
import "./auth.css";

// 초기 폼
const initialFindForm = { contact: "" };
const initialResetForm = { username: "", contact: "" };
const initialRecoveryForm = { password: "", passwordConfirm: "" };

// 초기 상태
const initialState = {
  activeTab: "find",
  loading: null,

  findForm: initialFindForm,
  resetForm: initialResetForm,
  recoveryForm: initialRecoveryForm,

  findResult: null,
  resetResult: null,
  recoveryResult: null,
};

// reducer
function reducer(state, action) {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "UPDATE_FIND_FORM":
      return {
        ...state,
        findForm: { ...state.findForm, ...action.payload },
      };

    case "UPDATE_RESET_FORM":
      return {
        ...state,
        resetForm: { ...state.resetForm, ...action.payload },
      };

    case "UPDATE_RECOVERY_FORM":
      return {
        ...state,
        recoveryForm: { ...state.recoveryForm, ...action.payload },
      };

    case "SET_RESULT":
      return {
        ...state,
        [action.key]: action.payload,
      };

    default:
      return state;
  }
}

function FindAccount() {
  const [searchParams] = useSearchParams();
  const { completePasswordReset, isPasswordRecovery } = useAuth();

  const [state, dispatch] = useReducer(reducer, initialState);

  // URL 또는 인증 상태에 따라 recovery 탭 전환
  useEffect(() => {
    if (isPasswordRecovery || searchParams.get("mode") === "recovery") {
      dispatch({ type: "SET_TAB", payload: "recovery" });
    }
  }, [isPasswordRecovery, searchParams]);

  // 아이디 찾기
  const handleFindUsername = async (e) => {
    e.preventDefault();

    dispatch({ type: "SET_RESULT", key: "findResult", payload: null });
    dispatch({ type: "SET_LOADING", payload: "find" });

    const result = await findUsername(state.findForm);

    dispatch({ type: "SET_LOADING", payload: null });
    dispatch({
      type: "SET_RESULT",
      key: "findResult",
      payload: result,
    });
  };

  // 비밀번호 재설정 요청
  const handleResetPassword = async (e) => {
    e.preventDefault();

    dispatch({ type: "SET_RESULT", key: "resetResult", payload: null });
    dispatch({ type: "SET_LOADING", payload: "reset" });

    const result = await resetPassword(state.resetForm);

    dispatch({ type: "SET_LOADING", payload: null });
    dispatch({
      type: "SET_RESULT",
      key: "resetResult",
      payload: result,
    });

    if (result.ok) {
      dispatch({
        type: "UPDATE_RESET_FORM",
        payload: initialResetForm,
      });
    }
  };

  // 새 비밀번호 설정
  const handleCompletePasswordReset = async (e) => {
    e.preventDefault();

    dispatch({ type: "SET_RESULT", key: "recoveryResult", payload: null });
    dispatch({ type: "SET_LOADING", payload: "recovery" });

    const result = await completePasswordReset(state.recoveryForm);

    dispatch({ type: "SET_LOADING", payload: null });
    dispatch({
      type: "SET_RESULT",
      key: "recoveryResult",
      payload: result,
    });

    if (result.ok) {
      dispatch({
        type: "UPDATE_RECOVERY_FORM",
        payload: initialRecoveryForm,
      });
    }
  };

  return (
    <div className="page auth-page">
      <section className="card auth-card auth-card-wide">
        <p className="eyebrow">Account</p>
        <h1>계정 찾기</h1>

        {/* 탭 */}
        <div className="auth-tabs">
          <button
            type="button"
            className={state.activeTab === "find" ? "active" : ""}
            onClick={() =>
              dispatch({ type: "SET_TAB", payload: "find" })
            }
          >
            아이디 찾기
          </button>

          <button
            type="button"
            className={state.activeTab === "reset" ? "active" : ""}
            onClick={() =>
              dispatch({ type: "SET_TAB", payload: "reset" })
            }
          >
            비밀번호 재설정
          </button>

          {state.activeTab === "recovery" && (
            <button type="button" className="active">
              새 비밀번호
            </button>
          )}
        </div>

        {/* 아이디 찾기 */}
        {state.activeTab === "find" && (
          <form onSubmit={handleFindUsername}>
            <h2>아이디 찾기</h2>

            <label>
              이메일
              <input
                type="email"
                value={state.findForm.contact}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIND_FORM",
                    payload: { contact: e.target.value },
                  })
                }
                required
              />
            </label>

            {state.findResult && (
              <p
                className={`form-message ${
                  state.findResult.ok ? "success" : ""
                }`}
              >
                {state.findResult.ok
                  ? `찾은 아이디: ${state.findResult.usernames.join(", ")}`
                  : state.findResult.message}
              </p>
            )}

            <Button shine type="submit" disabled={state.loading === "find"}>
              {state.loading === "find" ? "조회 중..." : "아이디 찾기"}
            </Button>
          </form>
        )}

        {/* 비밀번호 재설정 */}
        {state.activeTab === "reset" && (
          <form onSubmit={handleResetPassword}>
            <h2>비밀번호 재설정</h2>

            <label>
              아이디
              <input
                autoComplete="username"
                value={state.resetForm.username}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RESET_FORM",
                    payload: { username: e.target.value },
                  })
                }
                required
              />
            </label>

            <label>
              이메일
              <input
                type="email"
                value={state.resetForm.contact}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RESET_FORM",
                    payload: { contact: e.target.value },
                  })
                }
                required
              />
            </label>

            {state.resetResult && (
              <p
                className={`form-message ${
                  state.resetResult.ok ? "success" : ""
                }`}
              >
                {state.resetResult.message}
              </p>
            )}

            <Button shine type="submit" disabled={state.loading === "reset"}>
              {state.loading === "reset" ? "발송 중..." : "재설정 메일 받기"}
            </Button>
          </form>
        )}

        {/* 새 비밀번호 */}
        {state.activeTab === "recovery" && (
          <form onSubmit={handleCompletePasswordReset}>
            <h2>새 비밀번호 설정</h2>

            <label>
              새 비밀번호
              <input
                type="password"
                autoComplete="new-password"
                value={state.recoveryForm.password}
                minLength="8"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RECOVERY_FORM",
                    payload: { password: e.target.value },
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
                value={state.recoveryForm.passwordConfirm}
                minLength="8"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RECOVERY_FORM",
                    payload: { passwordConfirm: e.target.value },
                  })
                }
                required
              />
            </label>

            {state.recoveryResult && (
              <p
                className={`form-message ${
                  state.recoveryResult.ok ? "success" : ""
                }`}
              >
                {state.recoveryResult.message}
              </p>
            )}

            <Button
              shine
              type="submit"
              disabled={state.loading === "recovery"}
            >
              {state.loading === "recovery"
                ? "변경 중..."
                : "비밀번호 변경"}
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