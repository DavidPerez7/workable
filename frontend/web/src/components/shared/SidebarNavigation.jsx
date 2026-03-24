import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import reclutadoresApi from "../../api/reclutadoresApi";
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
        path: "/Reclutador/Ofertas",
        label: "Ofertas",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        path: "/Reclutador/Empresa",
        label: "Empresa",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21V7a2 2 0 0 1 2-2h3V3h4v2h3a2 2 0 0 1 2 2v14" />
            <path d="M3 21h18" />
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
    ],
  },
};

const SidebarNavigation = ({ variant = "reclutador" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = sidebarVariants[variant] || sidebarVariants.reclutador;
  const isActive = (item) => {
    if (variant === "reclutador" && item.path === "/Reclutador/Empresa") {
      return location.pathname === item.path || location.pathname.startsWith("/EmpresaPerfil/");
    }

    if (item.match === "includes") {
      return location.pathname.includes(item.path);
    }

    return location.pathname === item.path;
  };

  const handleNavigation = useCallback(async (item) => {
    if (variant === "reclutador" && item.path === "/Reclutador/Empresa") {
      try {
        const reclutador = await reclutadoresApi.getMyProfile();
        if (reclutador?.empresa?.id) {
          navigate(`/EmpresaPerfil/${reclutador.empresa.id}`, { replace: false });
          return;
        }
      } catch (err) {
        console.error("Error obteniendo empresa:", err);
      }
    }

    if (typeof item.path === 'function') {
      item.path();
    } else {
      navigate(item.path);
    }
  }, [navigate, variant]);

  const cerrarSesion = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  return (
    <aside className={config.shellClassName}>
      <div className="sidebar-navigation-controls">
        <button type="button" className="nav-control-button" onClick={goBack} title="Ir atrás">
          <ChevronLeft size={16} />
        </button>
        <button type="button" className="nav-control-button" onClick={goForward} title="Ir adelante">
          <ChevronRight size={16} />
        </button>
      </div>
      <nav className={config.navClassName}>
        {config.items.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavigation(item)}
            className={`${config.itemClassName} ${isActive(item) ? "active" : ""}`.trim()}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {config.profile ? (
          <Link to={config.profile.to} className={config.profileClassName}>
            {config.profile.label}
          </Link>
        ) : null}

        {variant === "aspirante" || variant === "reclutador" ? (
          <button type="button" className="sidebar-logout-button" onClick={cerrarSesion}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        ) : null}
      </nav>
    </aside>
  );
};

export default React.memo(SidebarNavigation);