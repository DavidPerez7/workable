import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SidebarNavigation.css";

const sidebarVariants = {
  reclutador: {
    shellClassName: "sidebar-nav sidebar-nav--reclutador",
    navClassName: "nav-list-sidebar",
    itemClassName: "nav-item-sidebar",
    profileClassName: "profile-button-sidebar",
    profile: {
      to: "/Reclutador/ReclutadorProfile",
      label: "Ver perfil",
    },
    items: [
      {
        path: "/Reclutador",
        label: "Inicio",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        ),
      },
      {
        path: "/Reclutador/GestigOferts",
        label: "Ofertas",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        path: "/Reclutador/RegistrarEmpresa",
        label: "Empresa",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21V7a2 2 0 0 1 2-2h3V3h4v2h3a2 2 0 0 1 2 2v14" />
            <path d="M3 21h18" />
          </svg>
        ),
      },
      {
        path: "/Reclutador/Configuracion",
        label: "Config",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6" />
          </svg>
        ),
      },
    ],
  },
  aspirante: {
    shellClassName: "sidebar-nav sidebar-nav--aspirante",
    navClassName: "nav-list-sidebar",
    itemClassName: "nav-item-sidebar",
    profileClassName: "",
    profile: null,
    items: [
      {
        path: "/Aspirante",
        label: "Inicio",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        ),
      },
      {
        path: "/Aspirante/MiPerfil",
        label: "Mi perfil",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        ),
      },
      {
        path: "/Aspirante/MiPerfil/HojaDeVida",
        label: "Hoja de vida",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        path: "/Aspirante/MisPostulaciones",
        label: "Postulaciones",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16" />
            <path d="M4 12h10" />
            <path d="M4 18h16" />
          </svg>
        ),
      },
    ],
  },
};

const SidebarNavigation = ({ variant = "reclutador" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = sidebarVariants[variant] || sidebarVariants.reclutador;

  const isActive = (item) => {
    if (item.match === "includes") {
      return location.pathname.includes(item.path);
    }

    return location.pathname === item.path;
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className={config.shellClassName}>
      <nav className={config.navClassName}>
        {config.items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${config.itemClassName} ${isActive(item) ? "active" : ""}`.trim()}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {config.profile ? (
          <Link to={config.profile.to} className={config.profileClassName}>
            {config.profile.label}
          </Link>
        ) : null}

        {variant === "aspirante" ? (
          <button type="button" className="sidebar-logout-button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        ) : null}
      </nav>
    </aside>
  );
};

export default SidebarNavigation;