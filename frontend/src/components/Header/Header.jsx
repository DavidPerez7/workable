import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaBriefcase, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "./Header.css";

const ofertasMock = [
  {
    id: 1,
    cargo: "Desarrollador Frontend",
    ciudad: "Medellín",
  },
  {
    id: 2,
    cargo: "Analista de Datos",
    ciudad: "Bogotá",
  },
  {
    id: 3,
    cargo: "Diseñador UX/UI",
    ciudad: "Medellín",
  },
];

function Header({ isLoggedIn = false, userRole = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Estados para búsqueda (solo si es aspirante)
  const [cargo, setCargo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [resultados, setResultados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Determinar si mostrar búsqueda y perfil
  const isAspirantePage = location.pathname.includes('/Aspirante');
  const showAspiranteFeatures = isLoggedIn && userRole === 'ASPIRANTE' && isAspirantePage;

  // Filtrar ofertas
  useEffect(() => {
    if (!showAspiranteFeatures) return;

    if (cargo.trim() === "" && ciudad.trim() === "") {
      setResultados([]);
      setShowDropdown(false);
      return;
    }

    const filtered = ofertasMock.filter((o) => {
      const matchCargo = cargo
        ? o.cargo.toLowerCase().includes(cargo.toLowerCase())
        : true;
      const matchCiudad = ciudad
        ? o.ciudad.toLowerCase().includes(ciudad.toLowerCase())
        : true;
      return matchCargo && matchCiudad;
    });

    setResultados(filtered);
    setShowDropdown(true);
  }, [cargo, ciudad, showAspiranteFeatures]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Redirección búsqueda
  const handleSearch = () => {
    navigate(
      `/Aspirante?cargo=${encodeURIComponent(cargo)}&ciudad=${encodeURIComponent(ciudad)}`
    );
  };

  return (
    <header className="header-container">
      <Link to="/" className="logo-container">
        <img
          src="https://i.ibb.co/gMwyTHb7/logotipo-workable.png"
          alt="Workable Logo"
          className="img-wkb"
        />
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        <FaBars className="menu-icon" />
      </button>

      {showAspiranteFeatures ? (
        <>
          {/* Barra de búsqueda para aspirante */}
          <div className={`job-search-bar ${menuOpen ? "show" : ""}`}>
            <div className="search-section">
              <FaBriefcase className="search-icon" />
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="input-text"
                placeholder="Cargo"
              />
            </div>
            <div className="divider" />
            <div className="search-section">
              <FaMapMarkerAlt className="search-icon" />
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="input-text"
                placeholder="Ciudad"
              />
            </div>
            <button className="search-btn" onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          {/* Dropdown de resultados */}
          {showDropdown && (
            <div className="search-dropdown" ref={dropdownRef}>
              {resultados.length > 0 ? (
                resultados.map((o) => (
                  <div
                    key={o.id}
                    className="dropdown-item"
                    onClick={() => {
                      setCargo(o.cargo);
                      setCiudad(o.ciudad);
                      setShowDropdown(false);
                      navigate(
                        `/Aspirante?cargo=${encodeURIComponent(o.cargo)}&ciudad=${encodeURIComponent(o.ciudad)}`
                      );
                    }}
                  >
                    <FaBriefcase className="dropdown-icon" />
                    <div>
                      <p className="dropdown-cargo">{o.cargo}</p>
                      <p className="dropdown-ciudad">{o.ciudad}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dropdown-no-results">
                  No encontramos ofertas que coincidan con tu búsqueda.
                </div>
              )}
            </div>
          )}

          {/* Menú de perfil para aspirante */}
          <div className={`user-profile-menu ${menuOpen ? "show" : ""}`}>
            <div className="user-info">
              <div className="avatar-placeholder">N</div>
            </div>
            <Link to="/Aspirante/MiPerfil">
              <button className="button-perfil">Ver Perfil</button>
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Navegación estándar */}
          <nav className={menuOpen ? "nav-list show" : "nav-list"}>
            <NavLink
              to="/Professional"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Perfil Profesional
            </NavLink>
            <NavLink
              to="/Salary"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Salarios
            </NavLink>
          </nav>

          {/* Menú de usuario estándar */}
          <div className={menuOpen ? "user-menu show" : "user-menu"}>
            <Link
              to="/Login"
              className="btn-login"
              onClick={() => setMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/SignUp"
              className="btn-signup-header"
              onClick={() => setMenuOpen(false)}
            >
              Registrarse
            </Link>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
