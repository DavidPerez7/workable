import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBriefcase, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "./HeaderAspirant.css";

const HeaderAspirant = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* BOTÓN MENÚ (Responsive) */}
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
            className="input-text-asp"
            placeholder="Cargo"
          />
        </div>

        <div className="divider-asp" />

        <div className="search-section-asp">
          <FaMapMarkerAlt className="search-icon-asp" />
          <input
            type="text"
            className="input-text-asp"
            placeholder="Ciudad"
          />
        </div>

        <button className="search-btn-asp">
          <FaSearch />
        </button>
      </div>

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
