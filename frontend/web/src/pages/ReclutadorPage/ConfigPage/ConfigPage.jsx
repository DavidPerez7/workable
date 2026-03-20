import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { logout } from "../../../api/authApi";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import "./ConfigPage.css";

const ConfigPage = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [codigoEmpresa, setCodigoEmpresa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await reclutadoresApi.getMyProfile();
        setPerfil(data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError(err.message || "No se pudo cargar la configuracion");
      }
    };

    cargarPerfil();
  }, []);

  const handleCerrarSesion = () => {
    if (!window.confirm("Quieres cerrar sesion?")) return;
    logout();
    navigate("/login");
  };

  const handleEliminarCuenta = async () => {
    if (!perfil?.id) return;
    const confirmar = window.confirm(
      "Esta accion es irreversible. Deseas eliminar tu cuenta?"
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      await reclutadoresApi.delete(perfil.id);
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      setError(err.message || "No se pudo eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarEmpresa = async (event) => {
    event.preventDefault();
    if (!codigoEmpresa.trim()) return;
    try {
      setLoading(true);
      await reclutadoresApi.updateByCode(codigoEmpresa.trim());
      setCodigoEmpresa("");
      window.location.reload();
    } catch (err) {
      console.error("Error al asignar empresa:", err);
      setError(err.message || "No se pudo asignar la empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReclutadorLayout>
      <ReclutadorCard>
        <ReclutadorSectionHeader
          kicker="Cuenta"
          title="Configuracion"
          action={(
            <Link to="/Reclutador/EditarPerfil" className="reclutador-link-RP">
              Editar perfil
            </Link>
          )}
        />
        <div className="config-info-RP">
          <span>Correo</span>
          <strong>{perfil?.correo || "Sin correo"}</strong>
        </div>
        {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}
      </ReclutadorCard>

      <ReclutadorCard>
        <ReclutadorSectionHeader kicker="Empresa" title="Asociar empresa por codigo" />
        <form className="config-form-RP" onSubmit={handleAsignarEmpresa}>
          <input
            type="text"
            placeholder="Codigo de empresa"
            value={codigoEmpresa}
            onChange={(event) => setCodigoEmpresa(event.target.value)}
            disabled={loading}
          />
          <ReclutadorButton type="submit" disabled={loading}>
            {loading ? "Asignando..." : "Asignar"}
          </ReclutadorButton>
        </form>
      </ReclutadorCard>

      <ReclutadorCard className="config-danger-RP">
        <ReclutadorSectionHeader kicker="Seguridad" title="Acciones rapidas" />
        <div className="config-actions-RP">
          <button type="button" className="config-secondary-RP" onClick={handleCerrarSesion}>
            Cerrar sesion
          </button>
          <button
            type="button"
            className="config-danger-button-RP"
            onClick={handleEliminarCuenta}
            disabled={loading}
          >
            Eliminar cuenta
          </button>
        </div>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
};

export default ConfigPage;
