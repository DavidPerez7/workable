import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBriefcase,
  FaWheelchair,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaIdCard,
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
import "./MiPerfil.css";

const MiPerfil = () => {
  const [aspirante, setAspirante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  const idAspirante = localStorage.getItem("idAspirante");
  const token = localStorage.getItem("token");

  // ============================================================
  // RF03: Obtener datos del perfil del aspirante
  // TODO: CONECTAR CON API - Por ahora usando datos de ejemplo
  // ============================================================
  const obtenerAspirante = async (id) => {
    try {
      // ❌ COMENTADO - Llamada a API
      // const response = await fetch(`http://localhost:8080/api/aspirante/${id}`, {
      //   method: 'GET',
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error("Error al obtener el perfil del aspirante");
      // }

      // const data = await response.json();

      // ✅ DATOS DE EJEMPLO - Simula la respuesta del backend
      const data = {
        id: id,
        nom: "Juan Carlos",
        ape: "Pérez González",
        cargo: "Desarrollador Full Stack",
        descripcion:
          "Desarrollador apasionado por crear soluciones tecnológicas inclusivas y accesibles. Con experiencia en React, Node.js y bases de datos.",
        numerDoc: "1020304050",
        nombreTipDoc: "C.C",
        nombreMunicipio: "Bogotá D.C",
        nombreGenero: "Masculino",
        tel: "3001234567",
        ubi: "Calle 123 #45-67, Bogotá",
        feNa: "1995-06-15",
        nombreDiscapacidad: "Discapacidad Motriz",
        fotoPerfilUrl: null, // Cambia a una URL válida si tienes imagen
      };

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAspirante(data);
      setError("");
    } catch (err) {
      console.error("Error obteniendo perfil:", err);
      setError("No se pudo cargar tu perfil. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RF04: Eliminar cuenta de aspirante
  // Criterios de aceptación:
  // - El sistema pide confirmación antes de eliminar
  // - Se eliminan todos los datos asociados (postulaciones/perfil)
  // - Requiere verificación con contraseña
  // TODO: CONECTAR CON API - Por ahora simula la eliminación
  // ============================================================
  const handleEliminarCuenta = async () => {
    // Validación de contraseña
    if (!deletePassword || deletePassword.trim().length === 0) {
      setDeleteError("Debes ingresar tu contraseña para confirmar");
      return;
    }

    try {
      // ❌ COMENTADO - Llamada a API
      // const response = await fetch(
      //   `http://localhost:8080/api/aspirante/${idAspirante}`,
      //   {
      //     method: "DELETE",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json"
      //     },
      //     body: JSON.stringify({
      //       clave: deletePassword // Verificación de contraseña
      //     })
      //   }
      // );

      // if (!response.ok) {
      //   if (response.status === 401) {
      //     setDeleteError("Contraseña incorrecta");
      //     return;
      //   }
      //   throw new Error("Error al eliminar la cuenta");
      // }

      // ✅ SIMULACIÓN - Por ahora simula validación de contraseña
      // Para testing, acepta cualquier contraseña con más de 4 caracteres
      if (deletePassword.length < 4) {
        setDeleteError("Contraseña incorrecta");
        return;
      }

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Éxito: limpiar localStorage y redirigir
      alert("Tu cuenta ha sido eliminada exitosamente");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Error eliminando cuenta:", err);
      setDeleteError("No se pudo eliminar la cuenta. Intenta de nuevo.");
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    // ✅ TEMPORAL - Usar datos simulados
    // Comentar validación de localStorage para testing
    // if (!idAspirante || !token) {
    //   setError("Sesión no válida. Por favor, inicia sesión nuevamente.");
    //   setLoading(false);
    //   navigate("/login");
    //   return;
    // }

    // Para testing, usar ID simulado si no existe en localStorage
    const testId = idAspirante || "1";
    obtenerAspirante(testId);
  }, [idAspirante, token, navigate]);

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
          onClick={() => obtenerAspirante(idAspirante)}
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
              {aspirante?.fotoPerfilUrl ? (
                <img
                  src={aspirante.fotoPerfilUrl}
                  alt={`${aspirante.nom} ${aspirante.ape}`}
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
                {aspirante?.nom} {aspirante?.ape}
              </h1>
              <p className="profile-cargo-MPF">
                {aspirante?.cargo || "Buscando oportunidades laborales"}
              </p>
              <div className="profile-status-MPF">
                <CheckCircle size={20} className="icon-check" />
                <span>Perfil activo</span>
              </div>
            </div>
          </section>

          {/* Resumen del Perfil */}
          {aspirante?.descripcion && (
            <section className="profile-summary-MPF">
              <h2>Acerca de mí</h2>
              <p>{aspirante.descripcion}</p>
            </section>
          )}

          <div className="profile-grid-MPF">
            {/* Información Personal */}
            <section className="card-info-MPF">
              <h2 className="card-title-MPF">
                <FaUser className="icon-title" />
                Información Personal
              </h2>

              <div className="info-list-MPF">
                <div className="info-item-MPF">
                  <FaIdCard className="info-icon" />
                  <div>
                    <span className="info-label">Documento</span>
                    <span className="info-value">
                      {aspirante?.nombreTipDoc || "N/A"}{" "}
                      {aspirante?.numerDoc || ""}
                    </span>
                  </div>
                </div>

                <div className="info-item-MPF">
                  <FaUser className="info-icon" />
                  <div>
                    <span className="info-label">Género</span>
                    <span className="info-value">
                      {aspirante?.nombreGenero || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="info-item-MPF">
                  <FaCalendar className="info-icon" />
                  <div>
                    <span className="info-label">Fecha de Nacimiento</span>
                    <span className="info-value">
                      {aspirante?.feNa
                        ? new Date(aspirante.feNa).toLocaleDateString("es-CO", {
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
                      {aspirante?.tel || "No registrado"}
                    </span>
                  </div>
                </div>

                <div className="info-item-MPF">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <span className="info-label">Municipio</span>
                    <span className="info-value">
                      {aspirante?.nombreMunicipio || "No especificado"}
                    </span>
                  </div>
                </div>

                {aspirante?.ubi && (
                  <div className="info-item-MPF">
                    <FaMapMarkerAlt className="info-icon" />
                    <div>
                      <span className="info-label">Ubicación</span>
                      <span className="info-value">{aspirante.ubi}</span>
                    </div>
                  </div>
                )}
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

              <button
                onClick={() => setShowDeleteModal(true)}
                className="action-card-MPF action-danger-MPF"
              >
                <Trash2 size={32} className="action-icon" />
                <h3>Eliminar Cuenta</h3>
                <p>Elimina permanentemente tu perfil</p>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Modal de Confirmación para Eliminar Cuenta (RF04) */}
      {showDeleteModal && (
        <div
          className="modal-overlay-MPF"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-content-MPF"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-MPF">
              <AlertCircle size={48} className="modal-icon-danger" />
              <h2>¿Eliminar cuenta?</h2>
            </div>

            <div className="modal-body-MPF">
              <p className="warning-text-MPF">
                Esta acción es <strong>permanente e irreversible</strong>.
              </p>
              <p>Se eliminarán:</p>
              <ul className="delete-list-MPF">
                <li>✓ Tu información personal</li>
                <li>✓ Todas tus postulaciones</li>
                <li>✓ Tu hoja de vida</li>
                <li>✓ Tus valoraciones</li>
              </ul>

              <div className="form-group-MPF">
                <label htmlFor="delete-password">
                  Ingresa tu contraseña para confirmar:
                </label>
                <input
                  type="password"
                  id="delete-password"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError("");
                  }}
                  placeholder="Tu contraseña"
                  className="input-delete-MPF"
                  autoFocus
                />
                {deleteError && (
                  <span className="error-message-MPF">{deleteError}</span>
                )}
              </div>
            </div>

            <div className="modal-footer-MPF">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="btn-cancel-MPF"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarCuenta}
                className="btn-delete-MPF"
                disabled={!deletePassword}
              >
                Eliminar mi cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MiPerfil;
