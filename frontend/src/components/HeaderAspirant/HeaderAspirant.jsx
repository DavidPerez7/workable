import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaBriefcase, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "./HeaderAspirant.css";

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

const HeaderAspirant = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [cargo, setCargo] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [resultados, setResultados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // -------- FILTRAR OFERTAS -------
  useEffect(() => {
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
  }, [cargo, ciudad]);

  // -------- REDIRECCIÓN (BOTÓN LUPA) -------
  const handleSearch = () => {
    navigate(
      `/Aspirante?cargo=${encodeURIComponent(
        cargo
      )}&ciudad=${encodeURIComponent(ciudad)}`
    );
  };

  // -------- CERRAR DROPDOWN AL HACER CLIC FUERA -------
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="header-container-asp">
      {/* LOGO */}
      <Link to="/" className="logo-container-asp">
        <img
          src="https://i.ibb.co/gMwyTHb7/logotipo-workable.png"
          alt="Logo"
          className="img-wkb-asp"
        />
      </Link>

      {/* MENÚ RESPONSIVE */}
      <button
        className="menu-toggle-asp"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars />
      </button>

      {/* BARRA DE BÚSQUEDA */}
      <div className={`job-search-bar-asp ${menuOpen ? "show-asp" : ""}`}>
        <div className="search-section-asp">
          <FaBriefcase className="search-icon-asp" />
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="input-text-asp"
            placeholder="Cargo"
          />
        </div>

        <div className="divider-asp" />

        <div className="search-section-asp">
          <FaMapMarkerAlt className="search-icon-asp" />
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="input-text-asp"
            placeholder="Ciudad"
          />
        </div>

        <button className="search-btn-asp" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>

      {/* -------- DROPDOWN DE RESULTADOS -------- */}
      {showDropdown && (
        <div className="search-dropdown-asp" ref={dropdownRef}>
          {resultados.length > 0 ? (
            resultados.map((o) => (
              <div
                key={o.id}
                className="dropdown-item-asp"
                onClick={() => {
                  setCargo(o.cargo);
                  setCiudad(o.ciudad);
                  setShowDropdown(false);

                  navigate(
                    `/Aspirante?cargo=${encodeURIComponent(
                      o.cargo
                    )}&ciudad=${encodeURIComponent(o.ciudad)}`
                  );
                }}
              >
                <FaBriefcase className="dropdown-icon-asp" />
                <div>
                  <p className="dropdown-cargo-asp">{o.cargo}</p>
                  <p className="dropdown-ciudad-asp">{o.ciudad}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="dropdown-no-results-asp">
              No encontramos ofertas que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      )}

      {/* PERFIL */}
      <div className={`user-profile-menu-asp ${menuOpen ? "show-asp" : ""}`}>
        <div className="user-info-asp">
          <div className="avatar-placeholder-asp">N</div>
          <span className="username-text-asp">Mi Perfil</span>
        </div>

        <Link to="/Aspirante/MiPerfil">
          <button className="button-perfil-asp">Ver Perfil</button>
        </Link>
      </div>
    </header>
  );
};

export default HeaderAspirant;
