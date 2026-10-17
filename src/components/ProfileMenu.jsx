import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = { username: "", email: "", password: "" };

export default function ProfileMenu() {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
    <li className="profile-nav-item">
      <Link to="/profil">
        <img src="/svg/Profil.svg" alt="" className="header-svg-icon" />
        <span>{user ?? "Mein Konto"}</span>
      </Link>

      <div className="profile-dropdown">
        {user ? (
          <div>
            <p className="user-welcome">
              Hallo, <strong>{user}</strong>!
            </p>
            <ul className="user-menu-list">
              <li><Link to="/merkliste">Meine Merkliste</Link></li>
              <li><Link to="/warenkorb">Mein Warenkorb</Link></li>
              <li><Link to="/profil">Mein Profil</Link></li>
            </ul>
            <button type="button" className="auth-btn logout" onClick={logout}>
              Abmelden
            </button>
          </div>
        ) : (
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
              type="password"
              name="password"
              placeholder="Passwort"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <p className="auth-error" role="alert">{error}</p>}
            {notice && <p className="auth-notice" role="status">{notice}</p>}

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
        )}
      </div>
    </li>
  );
}