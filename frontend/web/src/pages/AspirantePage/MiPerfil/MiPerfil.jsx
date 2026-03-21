import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeInfo,
  Mail,
  MapPin,
  PencilLine,
  Trash2,
  UserCircle2,
} from "lucide-react";
import AspiranteCard from "../../../components/aspirante/AspiranteCard";
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
          <h1>
            {usuario?.nombre} {usuario?.apellido}
          </h1>
          <p>{usuario?.correo || "Sin correo"}</p>
        </div>

        <div className="mi-perfil-hero-badge-AP">
          <strong>{usuario?.genero || "Género no registrado"}</strong>
          <span>{usuario?.fechaNacimiento ? new Date(usuario.fechaNacimiento).toLocaleDateString("es-CO") : "Sin fecha"}</span>
        </div>
      </section>

      <section className="mi-perfil-grid-AP">
        <AspiranteCard className="mi-perfil-card-AP">
          <div className="mi-perfil-card-header-AP">
            <BadgeInfo size={18} />
            <h2>Datos básicos</h2>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Id</span>
            <strong>{usuario?.id || usuario?.usuarioId || "No registrado"}</strong>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Nombre</span>
            <strong>{usuario?.nombre || "No registrado"}</strong>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Apellido</span>
            <strong>{usuario?.apellido || "No registrado"}</strong>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Correo</span>
            <strong>{usuario?.correo || "No registrado"}</strong>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Foto de perfil</span>
            <strong className="mi-perfil-link-value-AP">
              {usuario?.urlFotoPerfil ? (
                <a href={usuario.urlFotoPerfil} target="_blank" rel="noreferrer">
                  Ver URL
                </a>
              ) : (
                "No registrada"
              )}
            </strong>
          </div>
        </AspiranteCard>

        <AspiranteCard className="mi-perfil-card-AP">
          <div className="mi-perfil-card-header-AP">
            <Mail size={18} />
            <h2>Contacto</h2>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Teléfono</span>
            <strong>{usuario?.telefono || "No registrado"}</strong>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Fecha de nacimiento</span>
            <strong>
              {usuario?.fechaNacimiento
                ? new Date(usuario.fechaNacimiento).toLocaleDateString("es-CO")
                : "No registrada"}
            </strong>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Género</span>
            <strong>{usuario?.genero || "No registrado"}</strong>
          </div>
          <div className="mi-perfil-field-AP">
            <span>Municipio</span>
            <strong>{usuario?.municipio?.nombre || "No registrado"}</strong>
          </div>
        </AspiranteCard>
      </section>

      <AspiranteCard as="section" className="mi-perfil-actions-AP">
        <div className="mi-perfil-actions-grid-AP">
          <AspiranteButton as={Link} to="/Aspirante/MiPerfil/ActualizarPerfil" variant="action">
            <PencilLine size={28} />
            <strong>Actualizar perfil</strong>
            <span>Editar tus datos personales y de contacto.</span>
          </AspiranteButton>

          <AspiranteButton as={Link} to="/Aspirante/MiPerfil/EliminarPerfil" variant="action" className="danger">
            <Trash2 size={28} />
            <strong>Eliminar cuenta</strong>
            <span>Acción permanente para borrar tu perfil.</span>
          </AspiranteButton>
        </div>
      </AspiranteCard>
    </AspiranteLayout>
  );
};

export default MiPerfil;
