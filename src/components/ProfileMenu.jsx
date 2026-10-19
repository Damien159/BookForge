import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "./AuthForm";

export default function ProfileMenu() {
  const { user, logout } = useAuth();

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
          <AuthForm />
        )}
      </div>
    </li>
  );
}