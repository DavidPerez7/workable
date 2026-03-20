import { Link } from "react-router-dom";
import "./HeaderAdmin.css";

function HeaderAdmin() {
  return (
    <header className="header-container-adm">
      <Link to="/Administrador" className="logo-container-adm">
        <img
          src="https://i.ibb.co/gMwyTHb7/logotipo-workable.png"
          alt="workable logo"
          className="img-logo-adm"
        />
      </Link>

      <div className="admin-title-adm">
        <span className="admin-kicker-adm">Panel de control</span>
        <strong>Administrador</strong>
      </div>

      <div className="admin-title-adm admin-title-adm-mobile">
        <span className="admin-kicker-adm">Panel de control administrador</span>
      </div>
    </header>
  );
}

export default HeaderAdmin;