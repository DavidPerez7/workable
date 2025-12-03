import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import "./GestigOferts.css";

// ============================================
// DATOS SIMULADOS (COMENTAR AL USAR API)
// ============================================
const ofertasSimuladas = [
  {
    id: 1,
    titulo: "Desarrollador Frontend",
    fecha: "2025-07-08",
    estado: "ABIERTA",
  },
  {
    id: 2,
    titulo: "Analista de Datos",
    fecha: "2025-07-01",
    estado: "CERRADA",
  },
];

const GestigOfertsPage = () => {
  const navigate = useNavigate();

  // ============================================
  // ESTADOS
  // ============================================
  const [ofertas, setOfertas] = useState(ofertasSimuladas); // Cambiar a [] cuando uses la API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // OBTENER OFERTAS DESDE LA API (COMENTADO)
  // ============================================
  /*
  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Llamada a la API para obtener todas las ofertas
      const response = await fetch('http://localhost:8080/api/oferta', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las ofertas');
      }

      const data = await response.json();
      
      // Filtrar solo las ofertas del reclutador actual (opcional)
      // const reclutadorId = localStorage.getItem('userId');
      // const ofertasFiltradas = data.filter(oferta => oferta.reclutadorId === parseInt(reclutadorId));
      
      setOfertas(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  */

  // ============================================
  // EDITAR OFERTA
  // ============================================
  const handleEditar = (id) => {
    // Navegar a página de edición (crear esta página)
    navigate(`/Reclutador/Editar-Oferta/${id}`);

    // O mostrar modal de edición aquí
    // alert(`Editar oferta con ID: ${id}`);
  };

  // ============================================
  // ELIMINAR OFERTA (COMENTADO)
  // ============================================
  const handleEliminar = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar esta oferta?"
    );

    if (!confirmacion) return;

    // VERSIÓN SIMULADA (COMENTAR AL USAR API)
    alert(`Oferta con ID ${id} eliminada`);
    setOfertas(ofertas.filter((oferta) => oferta.id !== id));

    /*
    // VERSIÓN CON API (DESCOMENTAR AL USAR)
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Llamada DELETE a la API
      const response = await fetch(`http://localhost:8080/api/oferta/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la oferta');
      }

      // Actualizar estado local eliminando la oferta
      setOfertas(ofertas.filter(oferta => oferta.id !== id));
      
      alert('Oferta eliminada exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar la oferta: ' + err.message);
    }
    */
  };

  // ============================================
  // CAMBIAR ESTADO DE OFERTA (COMENTADO)
  // ============================================
  /*
  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Llamada PATCH para cambiar estado
      const response = await fetch(`http://localhost:8080/api/oferta/${id}/estado?estado=${nuevoEstado}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado de la oferta');
      }

      const data = await response.json();
      
      // Actualizar estado local
      setOfertas(ofertas.map(oferta => 
        oferta.id === id ? { ...oferta, estado: data.estado } : oferta
      ));
      
      alert('Estado actualizado exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cambiar el estado: ' + err.message);
    }
  };
  */

  // ============================================
  // FORMATEAR FECHA
  // ============================================
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ============================================
  // OBTENER TEXTO Y CLASE DEL ESTADO
  // ============================================
  const getEstadoInfo = (estado) => {
    const estadoUpper = estado?.toUpperCase();

    switch (estadoUpper) {
      case "ABIERTA":
        return { texto: "Activa", clase: "badge-activa-GO" };
      case "CERRADA":
        return { texto: "Cerrada", clase: "badge-cerrada-GO" };
      case "PAUSADA":
        return { texto: "Pausada", clase: "badge-pausada-GO" };
      default:
        return { texto: estado, clase: "badge-default-GO" };
    }
  };

  return (
    <>
      <HeaderReclutador />

      <main className="container-main-GO">
        <div className="header-section-GO">
          <h1 className="title-page-GO">Gestionar Ofertas</h1>
          <Link to="/Reclutador" className="link-goback-GO">
            ← Volver
          </Link>
        </div>

        <section className="section-card-GO">
          {ofertasSimuladas.length === 0 ? (
            <div className="empty-state-GO">
              <p className="empty-text-GO">No hay ofertas registradas.</p>
            </div>
          ) : (
            <div className="table-wrapper-GO">
              <table className="tabla-gestion-GO">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Fecha publicación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ofertasSimuladas.map((oferta) => (
                    <tr key={oferta.id}>
                      <td className="td-titulo-GO">{oferta.titulo}</td>
                      <td className="td-fecha-GO">{oferta.fecha}</td>
                      <td>
                        <span
                          className={`badge-estado-GO ${
                            oferta.estado === "Activa"
                              ? "badge-activa-GO"
                              : "badge-cerrada-GO"
                          }`}
                        >
                          {oferta.estado}
                        </span>
                      </td>
                      <td className="td-acciones-GO">
                        <button
                          className="btn-editar-GO"
                          onClick={() => handleEditar(oferta.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-eliminar-GO"
                          onClick={() => handleEliminar(oferta.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default GestigOfertsPage;
