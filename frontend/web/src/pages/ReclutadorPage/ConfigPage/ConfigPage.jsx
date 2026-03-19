import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { logout } from "../../../api/authApi";
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
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Cuenta</p>
                <h2>Configuracion</h2>
              </div>
              <Link to="/Reclutador/EditarPerfil" className="reclutador-link-RP">
                Editar perfil
              </Link>
            </div>
            <div className="config-info-RP">
              <span>Correo</span>
              <strong>{perfil?.correo || "Sin correo"}</strong>
            </div>
            {error && <p className="reclutador-alert-RP error">{error}</p>}
          </section>

          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Empresa</p>
                <h2>Asociar empresa por codigo</h2>
              </div>
            </div>
            <form className="config-form-RP" onSubmit={handleAsignarEmpresa}>
              <input
                type="text"
                placeholder="Codigo de empresa"
                value={codigoEmpresa}
                onChange={(event) => setCodigoEmpresa(event.target.value)}
                disabled={loading}
              />
              <button type="submit" className="reclutador-button-RP" disabled={loading}>
                {loading ? "Asignando..." : "Asignar"}
              </button>
            </form>
          </section>

          <section className="reclutador-card-RP config-danger-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Seguridad</p>
                <h2>Acciones rapidas</h2>
              </div>
            </div>
            <div className="config-actions-RP">
              <button
                type="button"
                className="config-secondary-RP"
                onClick={handleCerrarSesion}
              >
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
          </section>
        </main>
      </div>
    </>
  );
};

export default ConfigPage;
