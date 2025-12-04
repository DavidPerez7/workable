import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
} from "react-icons/fa";
import {
  CheckCircle,
  Eye,
  Settings,
  Rocket,
  Trash2,
  AlertCircle,
} from "lucide-react";
import HeaderAspirant from "../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../components/Menu/Menu";
import Footer from "../../../components/Footer/Footer";
import { getUsuario } from "../../../api/usuarioAPI";
import "./MiPerfil.css";

const MiPerfil = () => {
  const [aspirante, setAspirante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ============================================================
  // RF03: Obtener datos del perfil del aspirante
  // ============================================================
  const obtenerAspirante = async (id) => {
    try {
      const data = await getUsuario(id);
      
      // El backend retorna Optional, extraemos el valor
      const usuario = data || {};
      
      setAspirante(usuario);
      setError("");
    } catch (err) {
      console.error("Error obteniendo perfil:", err);
      setError("No se pudo cargar tu perfil. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (!userId || !token) {
      setError("Sesión no válida. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      navigate("/Login");
      return;
    }

    obtenerAspirante(userId);
  }, [userId, token, navigate]);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  if (error && !aspirante) {
    return (
      <div className="error-container">
        <AlertCircle size={48} className="error-icon" />
        <h2>Error al cargar perfil</h2>
        <p>{error}</p>
        <button
          onClick={() => obtenerAspirante(userId)}
          className="btn-retry"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <HeaderAspirant />
      <Menu />

      <main className="main-perfil-MPF">
        <div className="container-perfil-MPF">
          {/* Encabezado del Perfil */}
          <section className="profile-header-MPF">
            <div className="profile-pic-MPF">
              {aspirante?.urlFotoPerfil ? (
                <img
                  src={aspirante.urlFotoPerfil}
                  alt={`${aspirante.nombre} ${aspirante.apellido}`}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="profile-pic-placeholder-MPF">
                <FaUser size={64} />
              </div>
            </div>

            <div className="profile-info-MPF">
              <h1 className="profile-name-MPF">
                {aspirante?.nombre} {aspirante?.apellido}
              </h1>
              <p className="profile-cargo-MPF">
                Buscando oportunidades laborales
              </p>
              <div className="profile-status-MPF">
                <CheckCircle size={20} className="icon-check" />
                <span>Perfil {aspirante?.isActive ? 'activo' : 'inactivo'}</span>
              </div>
            </div>
          </section>

          {/* Resumen del Perfil */}
          <section className="profile-summary-MPF">
            <h2>Acerca de mí</h2>
            <p>Aspirante registrado en Workable</p>
          </section>

          <div className="profile-grid-MPF">
            {/* Información Personal */}
            <section className="card-info-MPF">
              <h2 className="card-title-MPF">
                <FaUser className="icon-title" />
                Información Personal
              </h2>

              <div className="info-list-MPF">
                <div className="info-item-MPF">
                  <FaUser className="info-icon" />
                  <div>
                    <span className="info-label">Correo</span>
                    <span className="info-value">
                      {aspirante?.correo || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="info-item-MPF">
                  <FaCalendar className="info-icon" />
                  <div>
                    <span className="info-label">Fecha de Nacimiento</span>
                    <span className="info-value">
                      {aspirante?.fechaNacimiento
                        ? new Date(aspirante.fechaNacimiento).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Información de Contacto */}
            <section className="card-info-MPF">
              <h2 className="card-title-MPF">
                <FaPhone className="icon-title" />
                Información de Contacto
              </h2>

              <div className="info-list-MPF">
                <div className="info-item-MPF">
                  <FaPhone className="info-icon" />
                  <div>
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">
                      {aspirante?.telefono || "No registrado"}
                    </span>
                  </div>
                </div>

                <div className="info-item-MPF">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <span className="info-label">Municipio</span>
                    <span className="info-value">
                      {aspirante?.municipio?.nombre || "No especificado"}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Acciones Rápidas */}
          <section className="quick-actions-MPF">
            <h2>Acciones</h2>
            <div className="actions-grid-MPF">
              <Link
                to="/ActualizarPerfil/ActualizarPerfil"
                className="action-card-MPF"
              >
                <Settings size={32} className="action-icon" />
                <h3>Editar Perfil</h3>
                <p>Actualiza tu información personal</p>
              </Link>

              <Link to="/MiPerfil/MisPostulaciones" className="action-card-MPF">
                <Rocket size={32} className="action-icon" />
                <h3>Mis Postulaciones</h3>
                <p>Revisa el estado de tus aplicaciones</p>
              </Link>

              <Link to="/MiPerfil/VerPerfil" className="action-card-MPF">
                <Eye size={32} className="action-icon" />
                <h3>Ver Mi Hoja de Vida</h3>
                <p>Mira cómo te ven los reclutadores</p>
              </Link>

              <Link
                to="/MiPerfil/EliminarPerfil"
                className="action-card-MPF action-danger-MPF"
              >
                <Trash2 size={32} className="action-icon" />
                <h3>Eliminar Cuenta</h3>
                <p>Elimina permanentemente tu perfil</p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MiPerfil;
