import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import AccountSettings from "../components/AccountSettings";

export default function Profile() {
  const { user } = useAuth();

  return (
    <main className="profile-container">
      <h2>Mein Profil</h2>

      {user ? (
                <>
          <section className="profile-section">
            <h3>Konto-Einstellungen</h3>
            <AccountSettings />
          </section>
        </>
      ) : (
        <div className="profile-box">
          <p>Du bist aktuell nicht angemeldet.</p>
          <AuthForm />
        </div>
      )}
    </main>
  );
}