import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
} from "lucide-react";
import reclutadoresApi from "../../api/reclutadoresApi";
import { getEmpresaById } from "../../api/empresaAPI";
import { getOfertasByEmpresaId } from "../../api/ofertasAPI";
import { obtenerPostulacionesPorOferta } from "../../api/postulacionesAPI";
import OfertaCard from "../../components/shared/OfertaCard";
import ReclutadorLayout from "./ReclutadorLayout";
import ReclutadorCard from "../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorButton from "../../components/reclutador/ReclutadorButton";
import ReclutadorEmptyState from "../../components/reclutador/ReclutadorEmptyState";
import ReclutadorAlert from "../../components/reclutador/ReclutadorAlert";
import "./ReclutadorPage.css";

const ReclutadorPage = () => {
  const [reclutador, setReclutador] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const datosReclutador = await reclutadoresApi.getMyProfile();
      setReclutador(datosReclutador);

      if (datosReclutador?.empresa?.id) {
        const empresaId = datosReclutador.empresa.id;
        
        const [empresaResult, ofertasResult] = await Promise.allSettled([
          getEmpresaById(empresaId),
          getOfertasByEmpresaId(empresaId),
        ]);

        if (empresaResult.status === "fulfilled") {
          setEmpresa(empresaResult.value);
        }

        if (ofertasResult.status === "fulfilled") {
          let ofertasConPostulaciones = Array.isArray(ofertasResult.value) ? ofertasResult.value : [];
          
          // Cargar postulaciones para cada oferta en paralelo
          if (ofertasConPostulaciones.length > 0) {
            const postulacionesPromesas = ofertasConPostulaciones.map(oferta =>
              obtenerPostulacionesPorOferta(oferta.id)
                .then(postulaciones => ({
                  ofertaId: oferta.id,
                  postulaciones: Array.isArray(postulaciones) ? postulaciones : []
                }))
                .catch(() => ({
                  ofertaId: oferta.id,
                  postulaciones: []
                }))
            );

            const postulacionesResultados = await Promise.all(postulacionesPromesas);
            
            // Mapear postulaciones a suas ofertas
            const mapPostulaciones = {};
            postulacionesResultados.forEach(({ ofertaId, postulaciones }) => {
              mapPostulaciones[ofertaId] = postulaciones.length;
            });

            // Enriquecer ofertas con conteo de postulaciones
            ofertasConPostulaciones = ofertasConPostulaciones.map(oferta => ({
              ...oferta,
              postulacionesCount: mapPostulaciones[oferta.id] || 0
            }));
          }
          
          setOfertas(ofertasConPostulaciones);
        } else {
          setOfertas([]);
        }
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.message || "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas
  const ofertasActivas = ofertas.filter(oferta => oferta.estadoOferta === "ABIERTA" || oferta.estado === "ACTIVA").length;
  const postulacionesTotales = ofertas.reduce((total, oferta) => total + (oferta.postulacionesCount || 0), 0);

  // Calcular ofertas recientes (5 más recientes y activas)
  const ofertasRecientes = ofertas
    .filter(oferta => oferta.estado === "ACTIVA")
    .sort((a, b) => {
      const fechaA = a.fechaPublicacion ? new Date(a.fechaPublicacion).getTime() : 0;
      const fechaB = b.fechaPublicacion ? new Date(b.fechaPublicacion).getTime() : 0;
      return fechaB - fechaA; // Descendente (más recientes primero)
    })
    .slice(0, 5);

  return (
    <ReclutadorLayout>
      {loading ? (
        <ReclutadorCard>Cargando...</ReclutadorCard>
      ) : (
        <>
          <ReclutadorCard as="section" className="reclutador-hero-RP">
            <div>
              <p className="reclutador-kicker-RP">Panel reclutador</p>
            </div>
            <div className="reclutador-hero-metrics-RP">
              <div className="metric-RP">
                <strong>{ofertasActivas}</strong>
                <span>Ofertas activas</span>
              </div>
              <div className="metric-RP">
                <strong>{postulacionesTotales}</strong>
                <span>Postulaciones totales</span>
              </div>
            </div>
          </ReclutadorCard>

          {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}

          <section className="reclutador-grid-RP">
            <ReclutadorCard as="article">
              <ReclutadorSectionHeader kicker="Mis ofertas" title="Ofertas Recientes" />

              {ofertas.length === 0 ? (
                <ReclutadorEmptyState action={(
                  <Link to="/Reclutador/Publicacion" className="reclutador-button-RP">
                    Crear oferta
                  </Link>
                )}>
                  <p>Aún no has publicado tu primera oferta.</p>
                </ReclutadorEmptyState>
              ) : (
                <>
                  <div className="reclutador-ofertas-list-RP">
                    {ofertasRecientes.map((oferta) => (
                      <OfertaCard 
                        key={oferta.id} 
                        oferta={oferta} 
                        rol="RECLUTADOR" 
                        variant="detailed" 
                      />
                    ))}
                  </div>
                  {ofertasRecientes.length > 0 && ofertas.length > ofertasRecientes.length && (
                    <div className="reclutador-view-all-RP">
                      <Link to="/Reclutador/Ofertas" className="reclutador-link-RP">
                        Ver todas las ofertas ({ofertasActivas})
                      </Link>
                    </div>
                  )}
                </>
              )}
            </ReclutadorCard>
          </section>
        </>
      )}

    </ReclutadorLayout>
  );
};

export default ReclutadorPage;
