import { Link } from "react-router-dom";
import "./Header.css";
function Header({ variant = "public", rightContent = null, className = "", showAuthActions = false }) {
  const showDefaultAuthActions = variant === "public" || showAuthActions;
  const isSimple = variant === "simple";

  return (
    <header className={`header-container ${isSimple ? "header-container--simple" : ""} ${className}`.trim()}>
      <Link to="/" className="logo-container">
        <img
          src="https://i.ibb.co/gMwyTHb7/logotipo-workable.png"
          alt="Workable Logo"
          className="img-wkb"
        />
      </Link>

      {rightContent ? <div className="header-right-content">{rightContent}</div> : null}

      {showDefaultAuthActions ? (
        <div className="header-actions">
          <Link to="/Login" className="btn-login">
            Iniciar Sesión
          </Link>
          <Link to="/SignUp" className="btn-signup-header">
            Registrarse
          </Link>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
