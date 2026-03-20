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
import AspiranteCard from "../../../components/aspirante/AspiranteCard";
import AspiranteSectionHeader from "../../../components/aspirante/AspiranteSectionHeader";
import AspiranteButton from "../../../components/aspirante/AspiranteButton";
import AspiranteLayout from "../AspiranteLayout";
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
      <AspiranteLayout shellClassName="mi-perfil-shell-AP" mainClassName="mi-perfil-main-AP">
        <div className="mi-perfil-state-AP asp-loading">Cargando perfil...</div>
      </AspiranteLayout>
    );
  }

  if (error && !usuario) {
    return (
      <AspiranteLayout shellClassName="mi-perfil-shell-AP" mainClassName="mi-perfil-main-AP">
        <div className="mi-perfil-state-AP error">
          <h2>No se pudo cargar el perfil</h2>
          <p>{error}</p>
          <AspiranteButton type="button" variant="secondary" onClick={cargarPerfil}>
            Reintentar
          </AspiranteButton>
        </div>
      </AspiranteLayout>
    );
  }

  return (
    <AspiranteLayout shellClassName="mi-perfil-shell-AP" mainClassName="mi-perfil-main-AP">
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
        <AspiranteCard className="mi-perfil-card-AP">
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
        </AspiranteCard>

        <AspiranteCard className="mi-perfil-card-AP">
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
        </AspiranteCard>

        <AspiranteCard className="mi-perfil-card-AP mi-perfil-card-wide-AP">
          <div className="mi-perfil-card-header-AP">
            <FileText size={18} />
            <h2>Resumen</h2>
          </div>
          <p>{usuario?.resumen || "Aún no has agregado un resumen profesional."}</p>
        </AspiranteCard>
      </section>

      <AspiranteCard as="section" className="mi-perfil-actions-AP">
        <AspiranteSectionHeader kicker="Acciones" title="Atajos del aspirante" />

        <div className="mi-perfil-actions-grid-AP">
          <AspiranteButton as={Link} to="/Aspirante/MiPerfil/ActualizarPerfil" variant="action">
            <PencilLine size={28} />
            <strong>Actualizar perfil</strong>
            <span>Editar tus datos personales y de contacto.</span>
          </AspiranteButton>

          <AspiranteButton as={Link} to="/Aspirante/MiPerfil/HojaDeVida" variant="action">
            <BookOpenText size={28} />
            <strong>Hoja de vida</strong>
            <span>Ver y actualizar tu información profesional.</span>
          </AspiranteButton>

          <AspiranteButton as={Link} to="/Aspirante/MiPerfil/MisPostulaciones" variant="action">
            <FileText size={28} />
            <strong>Mis postulaciones</strong>
            <span>Revisar y gestionar tus aplicaciones.</span>
          </AspiranteButton>

          <AspiranteButton as={Link} to="/Aspirante/MiPerfil/EliminarPerfil" variant="action" className="danger">
            <Trash2 size={28} />
            <strong>Eliminar cuenta</strong>
            <span>Acción permanente para borrar tu perfil.</span>
          </AspiranteButton>

          <AspiranteButton type="button" variant="action" onClick={cerrarSesion} className="warning">
            <LogOut size={28} />
            <strong>Cerrar sesión</strong>
            <span>Salir de la plataforma de aspirante.</span>
          </AspiranteButton>
        </div>
      </AspiranteCard>
    </AspiranteLayout>
  );
};

export default MiPerfil;
