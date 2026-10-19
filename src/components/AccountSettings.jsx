import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AccountSettings() {
  const { user, getEmail, updateAccount } = useAuth();
  const [email, setEmail] = useState(getEmail);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await updateAccount({ email, newPassword: password });

    if (result.ok) {
      setPassword("");
      setMessage({ type: "ok", text: "Deine Profildaten wurden aktualisiert." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="profile-username">Benutzername:</label>
        <input
          id="profile-username"
          type="text"
          value={user}
          disabled
          className="input-disabled"
        />
        <small className="hint-text">Der Benutzername kann nicht geändert werden.</small>
      </div>

      <div className="form-group">
        <label htmlFor="profile-email">E-Mail-Adresse:</label>
        <input
          id="profile-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="profile-password">Neues Passwort (optional):</label>
        <input
          id="profile-password"
          type="password"
          autoComplete="new-password"
          placeholder="Leer lassen für kein neues Passwort"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {message && (
        <p
          className={message.type === "ok" ? "auth-notice" : "auth-error"}
          role={message.type === "ok" ? "status" : "alert"}
        >
          {message.text}
        </p>
      )}

      <button type="submit" className="btn btn-success">
        Änderungen speichern
      </button>
    </form>
  );
}