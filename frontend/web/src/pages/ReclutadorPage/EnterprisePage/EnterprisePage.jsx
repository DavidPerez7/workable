import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEmpresaById } from "../../../api/empresaAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
import CrearEmpresaModal from "../../../components/reclutador/CrearEmpresaModal";
import UnirseEmpresaModal from "../../../components/reclutador/UnirseEmpresaModal";
import "./EnterprisePage.css";

function EnterprisePage() {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isUnirseModalOpen, setIsUnirseModalOpen] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");
        const reclutador = await reclutadoresApi.getMyProfile();
        const empresaId = reclutador?.empresa?.id;

        if (!empresaId) {
          setEmpresa(null);
          setOfertas([]);
          return;
        }

        const empresaData = await getEmpresaById(empresaId);

        setEmpresa(empresaData);
        const ofertasEmpresa =
          empresaData?.ofertas ||
          empresaData?.listaOfertas ||
          empresaData?.ofertasActivas ||
          [];
        setOfertas(Array.isArray(ofertasEmpresa) ? ofertasEmpresa : []);
      } catch (err) {
        console.error("Error al cargar empresa:", err);
        setError(err.message || "No se pudo cargar la empresa");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleEmpresaSuccess = () => {
    // Recargar la página para mostrar la empresa
    window.location.reload();
  };

  return (
    <ReclutadorLayout shellClassName="empresa-shell-EP" mainClassName="empresa-main-EP">
      {empresa ? (
        <>
          <section className="empresa-hero-EP">
            <div className="empresa-avatar-EP">
              {empresa?.logo ? (
                <img src={empresa.logo} alt={empresa.nombre} />
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

          <ReclutadorCard as="section" className="empresa-actions-EP">
            <div className="empresa-actions-grid-EP">
              <ReclutadorButton type="button" onClick={() => navigate("/Reclutador/EnterprisePage/Edit")} variant="action">
                <strong>Editar empresa</strong>
                <span>Actualizar datos corporativos.</span>
              </ReclutadorButton>

              <ReclutadorButton as={Link} to="/Reclutador/Publicacion" variant="action">
                <strong>Crear oferta</strong>
                <span>Publicar nueva oportunidad laboral.</span>
              </ReclutadorButton>
            </div>
          </ReclutadorCard>
        </>
      ) : (
        <>
          {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}

          {loading ? (
            <ReclutadorCard>Cargando empresa...</ReclutadorCard>
          ) : (
            <ReclutadorCard>
              <p className="empresa-empty-EP">Aun no tienes empresa registrada.</p>
              <div className="empresa-actions-EP">
                <ReclutadorButton onClick={() => setIsCrearModalOpen(true)}>
                  Crear Empresa
                </ReclutadorButton>
                <ReclutadorButton variant="secondary" onClick={() => setIsUnirseModalOpen(true)}>
                  Unirse a Empresa
                </ReclutadorButton>
              </div>
            </ReclutadorCard>
          )}
        </>
      )}

      <CrearEmpresaModal
        isOpen={isCrearModalOpen}
        onClose={() => setIsCrearModalOpen(false)}
        onSuccess={handleEmpresaSuccess}
      />
      <UnirseEmpresaModal
        isOpen={isUnirseModalOpen}
        onClose={() => setIsUnirseModalOpen(false)}
        onSuccess={handleEmpresaSuccess}
      />
    </ReclutadorLayout>
  );
}

export default EnterprisePage;
