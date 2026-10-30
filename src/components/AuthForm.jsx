import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = { username: "", email: "", password: "" };

export default function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (mode === "login") {
      const result = await login(form.username, form.password);
      if (!result.ok) return setError(result.error);
      setForm(EMPTY_FORM);
      return;
    }

    const result = await register(form.username, form.email, form.password);
    if (!result.ok) return setError(result.error);
    setForm({ ...EMPTY_FORM, username: form.username });
    setMode("login");
    setNotice("Konto erstellt. Du kannst dich jetzt anmelden.");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h4>{mode === "login" ? "Anmelden" : "Registrieren"}</h4>

      <input
        type="text"
        name="username"
        placeholder={mode === "login" ? "Benutzername oder E-Mail" : "Benutzername"}
        autoComplete="username"
        value={form.username}
        onChange={handleChange}
        required
      />
      {mode === "register" && (
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      )}
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Passwort"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        value={form.password}
        onChange={handleChange}
        required
      />

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="auth-notice" role="status">
          {notice}
        </p>
      )}

      <label className="show-password">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(event) => setShowPassword(event.target.checked)}
        />
        Passwort anzeigen
      </label>

      <button type="submit" className="auth-btn">
        {mode === "login" ? "Einloggen" : "Konto erstellen"}
      </button>

      <p className="auth-toggle-text">
        {mode === "login" ? "Noch kein Konto? " : "Bereits ein Konto? "}
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            switchMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login" ? "Jetzt registrieren" : "Anmelden"}
        </a>
      </p>
    </form>
  );
}