import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

export default function Profile() {
  const { user } = useAuth();

  return (
    <main className="profile-container">
      <h2>Mein Profil</h2>

      {user ? (
        <p>Hallo, {user}!</p>
      ) : (
        <div className="profile-box">
          <p>Du bist aktuell nicht angemeldet.</p>
          <AuthForm />
        </div>
      )}
    </main>
  );
}