import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import "./EnterprisePage.css";

function EnterprisePage() {
  const navigate = useNavigate();
  const [reclutador, setReclutador] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [codigoInvitacion, setCodigoInvitacion] = useState("");
  const [uniendo, setUniendo] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const perfil = await reclutadoresApi.getMyProfile();
        setReclutador(perfil);
        setEmpresa(perfil?.empresa);
        if (perfil?.empresa?.id) {
          navigate(`/EmpresaPerfil/${perfil.empresa.id}`, { replace: true });
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [navigate]);

  const handleUnirseEmpresa = async (e) => {
    e.preventDefault();
    if (!codigoInvitacion.trim()) {
      setError("Por favor ingresa un código de invitación");
      return;
    }

    try {
      setUniendo(true);
      setError("");
      await reclutadoresApi.unirseEmpresa(codigoInvitacion);
      // Recargar el perfil para mostrar la empresa
      const perfilActualizado = await reclutadoresApi.getMyProfile();
      setReclutador(perfilActualizado);
      setEmpresa(perfilActualizado?.empresa);
      if (perfilActualizado?.empresa?.id) {
        navigate(`/EmpresaPerfil/${perfilActualizado.empresa.id}`, { replace: true });
        return;
      }
      setCodigoInvitacion("");
    } catch (err) {
      console.error("Error al unirse a empresa:", err);
      setError(err.response?.data?.error || "Error al unirse a la empresa");
    } finally {
      setUniendo(false);
    }
  };

  if (loading) {
    return (
      <ReclutadorLayout>
        <div className="loading-container">Cargando...</div>
      </ReclutadorLayout>
    );
  }

  return (
    <ReclutadorLayout shellClassName="empresa-shell-EP" mainClassName="empresa-main-EP">
      {empresa ? (
        // Mostrar información de la empresa si ya pertenece a una
        <>
          <section className="empresa-hero-EP">
            <div className="empresa-avatar-EP">
              {empresa?.logoUrl ? (
                <img src={empresa.logoUrl} alt={empresa.nombre} />
              ) : (
                <span>{empresa?.nombre?.charAt(0) || "E"}</span>
              )}
            </div>

            <div className="empresa-hero-text-EP">
              <h1>{empresa.nombre}</h1>
              <p>{empresa.email || "Sin email"}</p>
            </div>

            <div className="empresa-hero-badge-EP">
              <strong>NIT: {empresa.nit || "Sin NIT"}</strong>
              <span>{empresa.municipio?.nombre || "Sin ubicación"}</span>
            </div>
          </section>

          <section className="empresa-grid-EP">
            <ReclutadorCard className="empresa-card-EP">
              <div className="empresa-card-header-EP">
                <h2>Datos básicos</h2>
              </div>
              <div className="empresa-field-EP">
                <span>Nombre</span>
                <strong>{empresa.nombre || "No registrado"}</strong>
              </div>
              <div className="empresa-field-EP">
                <span>NIT</span>
                <strong>{empresa.nit || "No registrado"}</strong>
              </div>
              <div className="empresa-field-EP">
                <span>Número de trabajadores</span>
                <strong>{empresa.numeroTrabajadores || "No registrado"}</strong>
              </div>
              <div className="empresa-field-EP">
                <span>Descripción</span>
                <strong>{empresa.descripcion || "No registrada"}</strong>
              </div>
            </ReclutadorCard>

            <ReclutadorCard className="empresa-card-EP">
              <div className="empresa-card-header-EP">
                <h2>Contacto</h2>
              </div>
              <div className="empresa-field-EP">
                <span>Email</span>
                <strong>{empresa.email || "No registrado"}</strong>
              </div>
              <div className="empresa-field-EP">
                <span>Teléfono</span>
                <strong>{empresa.telefono || "No registrado"}</strong>
              </div>
              <div className="empresa-field-EP">
                <span>Municipio</span>
                <strong>{empresa.municipio?.nombre || "No registrado"}</strong>
              </div>
            </ReclutadorCard>
          </section>
        </>
      ) : (
        // Mostrar formulario para unirse a empresa si no pertenece a ninguna
        <section className="unirse-empresa-section">
          <ReclutadorCard className="unirse-empresa-card">
            <div className="unirse-empresa-header">
              <h2>Únete a una Empresa</h2>
              <p>Ingresa el código de invitación que te proporcionó tu empresa</p>
            </div>

            <form onSubmit={handleUnirseEmpresa} className="unirse-empresa-form">
              <div className="form-group">
                <label htmlFor="codigoInvitacion">Código de Invitación</label>
                <input
                  type="text"
                  id="codigoInvitacion"
                  value={codigoInvitacion}
                  onChange={(e) => setCodigoInvitacion(e.target.value)}
                  placeholder="Ingresa el código de invitación"
                  required
                  disabled={uniendo}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <ReclutadorButton
                type="submit"
                variant="primary"
                disabled={uniendo || !codigoInvitacion.trim()}
              >
                {uniendo ? "Uniéndose..." : "Unirse a Empresa"}
              </ReclutadorButton>
            </form>

            <div className="unirse-empresa-footer">
              <p>¿No tienes un código? Contacta al administrador de tu empresa.</p>
            </div>
          </ReclutadorCard>
        </section>
      )}
    </ReclutadorLayout>
  );
}

export default EnterprisePage;
