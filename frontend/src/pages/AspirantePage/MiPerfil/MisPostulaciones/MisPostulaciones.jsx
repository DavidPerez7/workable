import React, { useState, useEffect } from "react";
import HeaderAspirant from "../../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../../components/Menu/Menu"
import "./MisPostulaciones.css";

const MisPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================
  //   🚀 SIMULACIÓN DE POSTULACIONES
  // ============================================
  const mockPostulaciones = [
    {
      id: 1,
      oferta: "Desarrollador Frontend",
      empresa: "Nexabyte Solutions",
      fechaPostulacion: "2025-02-12",
      estado: "En revisión",
      modalidad: "Presencial",
      contrato: "Término Fijo",
      ciudad: "Medellín, Antioquia",
      salario: 2500000,
    },
    {
      id: 2,
      oferta: "Analista de Datos",
      empresa: "Codexia Tech Labs",
      fechaPostulacion: "2025-02-10",
      estado: "Pendiente",
      modalidad: "Remoto",
      contrato: "Indefinido",
      ciudad: "Bogotá, Cundinamarca",
      salario: 3200000,
    },
    {
      id: 3,
      oferta: "Especialista QA",
      empresa: "Lumitech Global",
      fechaPostulacion: "2025-01-20",
      estado: "Rechazado",
      modalidad: "Presencial",
      contrato: "Aprendiz",
      ciudad: "Cali, Valle",
      salario: 1800000,
    },
  ];

  // ============================================
  //   📌 OBTENER POSTULACIONES – API REAL
  //   (Actualmente Comentado)
  // ============================================

  /*
  useEffect(() => {
    obtenerPostulaciones();
  }, []);

  const obtenerPostulaciones = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/postulaciones/aspirante", {
        method: "GET",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al obtener postulaciones");

      const data = await response.json();
      setPostulaciones(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  */

  // ============================================
  //  🚀 SIMULACIÓN ACTIVA POR DEFECTO
  // ============================================
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPostulaciones(mockPostulaciones);
      setLoading(false);
    }, 800);
  }, []);

  const formatSalary = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <>
    <HeaderAspirant />
    <Menu />
    <div className="mispostulaciones-container-MP">

      <h2 className="mp-title">Mis postulaciones</h2>
      <p className="mp-subtitle">
        Aquí puedes ver todas las ofertas a las que te has postulado.
      </p>

      {loading ? (
        <p className="mp-loading">Cargando postulaciones...</p>
      ) : postulaciones.length === 0 ? (
        <div className="mp-empty">
          <p>No tienes postulaciones registradas.</p>
        </div>
      ) : (
        <div className="mp-list">
          {postulaciones.map((post) => (
            <div key={post.id} className="mp-card">

              <div className="mp-card-header">
                <h3 className="mp-job-title">{post.oferta}</h3>
                <span
                  className={`mp-status ${
                    post.estado === "En revisión"
                      ? "mp-status-review"
                      : post.estado === "Pendiente"
                      ? "mp-status-pending"
                      : "mp-status-rejected"
                  }`}
                >
                  {post.estado}
                </span>
              </div>

              <p className="mp-company">{post.empresa}</p>
              <p className="mp-location">{post.ciudad}</p>

              <div className="mp-tags">
                <span className="mp-tag modalidad">{post.modalidad}</span>
                <span className="mp-tag contrato">{post.contrato}</span>
              </div>

              <div className="mp-footer">
                <p className="mp-salary">{formatSalary(post.salario)}</p>
                <p className="mp-date">Postulado el: {post.fechaPostulacion}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default MisPostulaciones;
