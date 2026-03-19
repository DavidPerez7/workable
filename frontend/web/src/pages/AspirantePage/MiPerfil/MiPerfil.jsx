import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpenText,
  FileText,
  LogOut,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Trash2,
  UserCircle2,
} from "lucide-react";
import Header from "../../../components/Header/Header";
import SidebarAspirante from "../../../components/SidebarAspirante/SidebarAspirante";
import Footer from "../../../components/Footer/footer";
import aspirantesApi from "../../../api/aspirantesApi";
import "./MiPerfil.css";

const MiPerfil = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarPerfil = async () => {
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await aspirantesApi.get(usuarioId);
      setUsuario(data);
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      setError(err.message || "No se pudo cargar el perfil");
      if (String(err.message || "").includes("401") || String(err.message || "").includes("404")) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="mi-perfil-state-AP">
        Cargando perfil...
      </div>
    );
  }

  if (error && !usuario) {
    return (
      <div className="mi-perfil-state-AP error">
        <h2>No se pudo cargar el perfil</h2>
        <p>{error}</p>
        <button type="button" onClick={cargarPerfil} className="mi-perfil-button-AP">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />

      <div className="mi-perfil-shell-AP">
        <SidebarAspirante />

        <main className="mi-perfil-main-AP">
          <section className="mi-perfil-hero-AP">
            <div className="mi-perfil-avatar-AP">
              {usuario?.urlFotoPerfil ? (
                <img src={usuario.urlFotoPerfil} alt={`${usuario.nombre} ${usuario.apellido}`} />
              ) : (
                <UserCircle2 size={60} />
              )}
            </div>

            <div className="mi-perfil-hero-text-AP">
              <p className="mi-perfil-kicker-AP">Mi perfil</p>
              <h1>
                {usuario?.nombre} {usuario?.apellido}
              </h1>
              <p>{usuario?.descripcion || "Resumen no disponible"}</p>
            </div>

            <div className="mi-perfil-hero-badge-AP">
              <strong>Perfil activo</strong>
              <span>{usuario?.municipio?.nombre || "Sin ubicación"}</span>
            </div>
          </section>

          <section className="mi-perfil-grid-AP">
            <article className="mi-perfil-card-AP">
              <div className="mi-perfil-card-header-AP">
                <Mail size={18} />
                <h2>Contacto</h2>
              </div>
              <div className="mi-perfil-field-AP">
                <span>Correo</span>
                <strong>{usuario?.correo || "No registrado"}</strong>
              </div>
              <div className="mi-perfil-field-AP">
                <span>Teléfono</span>
                <strong>{usuario?.telefono || "No registrado"}</strong>
              </div>
            </article>

            <article className="mi-perfil-card-AP">
              <div className="mi-perfil-card-header-AP">
                <MapPin size={18} />
                <h2>Ubicación</h2>
              </div>
              <div className="mi-perfil-field-AP">
                <span>Municipio</span>
                <strong>{usuario?.municipio?.nombre || "No registrado"}</strong>
              </div>
              <div className="mi-perfil-field-AP">
                <span>Departamento</span>
                <strong>{usuario?.municipio?.departamento || "No registrado"}</strong>
              </div>
              <div className="mi-perfil-field-AP">
                <span>Fecha de nacimiento</span>
                <strong>
                  {usuario?.fechaNacimiento
                    ? new Date(usuario.fechaNacimiento).toLocaleDateString("es-CO")
                    : "No registrada"}
                </strong>
              </div>
            </article>

            <article className="mi-perfil-card-AP mi-perfil-card-wide-AP">
              <div className="mi-perfil-card-header-AP">
                <FileText size={18} />
                <h2>Resumen</h2>
              </div>
              <p>{usuario?.resumen || "Aún no has agregado un resumen profesional."}</p>
            </article>
          </section>

          <section className="mi-perfil-actions-AP">
            <div className="mi-perfil-section-header-AP">
              <p className="mi-perfil-kicker-AP">Acciones</p>
              <h2>Atajos del aspirante</h2>
            </div>

            <div className="mi-perfil-actions-grid-AP">
              <Link to="/Aspirante/MiPerfil/ActualizarPerfil" className="mi-perfil-action-card-AP">
                <PencilLine size={28} />
                <strong>Actualizar perfil</strong>
                <span>Editar tus datos personales y de contacto.</span>
              </Link>

              <Link to="/Aspirante/MiPerfil/HojaDeVida" className="mi-perfil-action-card-AP">
                <BookOpenText size={28} />
                <strong>Hoja de vida</strong>
                <span>Ver y actualizar tu información profesional.</span>
              </Link>

              <Link to="/Aspirante/MiPerfil/MisPostulaciones" className="mi-perfil-action-card-AP">
                <FileText size={28} />
                <strong>Mis postulaciones</strong>
                <span>Revisar y gestionar tus aplicaciones.</span>
              </Link>

              <Link to="/Aspirante/MiPerfil/EliminarPerfil" className="mi-perfil-action-card-AP danger">
                <Trash2 size={28} />
                <strong>Eliminar cuenta</strong>
                <span>Acción permanente para borrar tu perfil.</span>
              </Link>

              <button type="button" onClick={cerrarSesion} className="mi-perfil-action-card-AP warning">
                <LogOut size={28} />
                <strong>Cerrar sesión</strong>
                <span>Salir de la plataforma de aspirante.</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default MiPerfil;
