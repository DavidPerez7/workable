import React, { useState, useEffect } from "react";
import HeaderReclutador from "../HeaderReclutador/HeaderReclutador";
import "./VerPostulacionesRecibidas.css";

const VerPostulacionesRecibidas = () => {
  // ===============================
  // 📌 SIMULACIÓN DE DATOS (TEMP)
  // ===============================

  const postulacionesSimuladas = [
    {
      id: 1,
      aspirante: "Juan Pérez",
      oferta: "Diseñador UX/UI",
      fecha: "2024-01-10",
      estado: "En proceso",
      correo: "juan.perez@example.com",
      telefono: "3001234567",
    },
    {
      id: 2,
      aspirante: "María Gomez",
      oferta: "Desarrollador Frontend",
      fecha: "2024-03-04",
      estado: "Aprobada",
      correo: "maria.gomez@example.com",
      telefono: "3109876543",
    },
    {
      id: 3,
      aspirante: "Carlos Díaz",
      oferta: "Analista QA",
      fecha: "2024-06-20",
      estado: "Rechazada",
      correo: "carlos.diaz@example.com",
      telefono: "3205558899",
    },
    {
      id: 4,
      aspirante: "Paola Rodríguez",
      oferta: "Diseñador UX/UI",
      fecha: "2024-09-15",
      estado: "En proceso",
      correo: "paola.rod@example.com",
      telefono: "3154448899",
    },
  ];

  // =====================================
  // 📌 ESTADOS DE FILTRO + RESULTADOS
  // =====================================
  const [postulaciones, setPostulaciones] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [ordenFecha, setOrdenFecha] = useState("asc");
  const [filtroOferta, setFiltroOferta] = useState("todas");

  useEffect(() => {
    // ======================================================
    // 📌 PETICIÓN API REAL (COMENTADA)
    // ======================================================
    /*
    fetch("https://api.tu-backend.com/postulaciones")
      .then(res => res.json())
      .then(data => {
        setPostulaciones(data);
      });
    */

    // Simulación temporal
    setPostulaciones(postulacionesSimuladas);
  }, []);
  // =====================================
  // 📌 FILTROS LOGIC
  // =====================================

  const obtenerPostulacionesFiltradas = () => {
    let resultado = [...postulaciones];

    // Filtro por estado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter((p) => p.estado === filtroEstado);
    }

    // Filtro por oferta
    if (filtroOferta !== "todas") {
      resultado = resultado.filter((p) => p.oferta === filtroOferta);
    }

    // Orden por fecha
    resultado.sort((a, b) => {
      return ordenFecha === "asc"
        ? new Date(a.fecha) - new Date(b.fecha)
        : new Date(b.fecha) - new Date(a.fecha);
    });

    return resultado;
  };

  const postulacionesFiltradas = obtenerPostulacionesFiltradas();

  // Lista dinámica de ofertas disponibles
  const ofertasUnicas = [
    "todas",
    ...new Set(postulacionesSimuladas.map((p) => p.oferta)),
  ];

  return (
    <>
      <HeaderReclutador />
      <main className="vp-page">
        <h1 className="vp-title">Todas las postulaciones recibidas</h1>

        {/* ======== CONTROLES DE FILTRO ======== */}
        <div className="vp-filters">
          <div className="vp-filter-group">
            <label>Estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Aprobada">Aprobada</option>
              <option value="En proceso">En proceso</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>

          <div className="vp-filter-group">
            <label>Orden por fecha:</label>
            <select
              value={ordenFecha}
              onChange={(e) => setOrdenFecha(e.target.value)}
            >
              <option value="asc">Antiguas → Recientes</option>
              <option value="desc">Recientes → Antiguas</option>
            </select>
          </div>

          <div className="vp-filter-group">
            <label>Oferta aplicada:</label>
            <select
              value={filtroOferta}
              onChange={(e) => setFiltroOferta(e.target.value)}
            >
              {ofertasUnicas.map((o, i) => (
                <option key={i} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="vp-count">
          {postulacionesFiltradas.length} resultados encontrados
        </p>

        {/* ======== LISTA DE POSTULACIONES ======== */}
        <div className="vp-container">
          {postulacionesFiltradas.map((p) => (
            <div className="vp-item" key={p.id}>
              <div className="vp-header">
                <div className="vp-avatar">{p.aspirante.charAt(0)}</div>

                <div className="vp-info">
                  <p className="vp-name">{p.aspirante}</p>
                  <p className="vp-status">{p.estado}</p>
                </div>
              </div>

              <p className="vp-text">
                Oferta aplicada: <strong>{p.oferta}</strong>
              </p>
              <p className="vp-text">Fecha: {p.fecha}</p>
              <p className="vp-text">Correo: {p.correo}</p>
              <p className="vp-text">Teléfono: {p.telefono}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default VerPostulacionesRecibidas;
