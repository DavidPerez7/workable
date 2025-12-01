import React, { useState, useEffect } from "react";
import { getHojasDeVidaPorAspirante } from "../../../api/hojaDeVidaAPI";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBriefcase, FaWheelchair } from "react-icons/fa";
import {
  CheckCircle,
  Eye,
  IdCard,
  Rocket,
  Settings,
  BadgeDollarSign,
} from "lucide-react";
import HeaderAspirant from "../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../components/Menu/Menu";
import "./MiPerfil.css";

const MiPerfil = () => {
  const [aspirante, setAspirante] = useState(null);
  const [hojasDeVida, setHojasDeVida] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const idAspirante = localStorage.getItem("idAspirante");
  const token = localStorage.getItem("token");

  // Obtener perfil desde backend
  const obtenerAspirante = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/aspirante/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al obtener el perfil");

      const data = await res.json();
      setAspirante(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el perfil");
      setLoading(false);
    }
  };

  // Eliminar perfil
  const handleEliminar = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar tu perfil? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/aspirante/${idAspirante}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar perfil");

      alert("Perfil eliminado correctamente");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el perfil");
    }
  };

  useEffect(() => {
    if (idAspirante) {
      obtenerAspirante(idAspirante);
      getHojasDeVidaPorAspirante(idAspirante)
        .then(setHojasDeVida)
        .catch(() => setHojasDeVida([]));
    } else {
      setError("No hay ID de aspirante guardado en localStorage");
      setLoading(false);
    }
  }, [idAspirante]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <HeaderAspirant />
      <Menu />

      <main className="main-perfil">
        <section className="hojas-de-vida-section">
          <h2>Mis Hojas de Vida</h2>
          {hojasDeVida.length === 0 ? (
            <p>No tienes hojas de vida registradas.</p>
          ) : (
            <ul>
              {hojasDeVida.map((hv) => (
                <li key={hv.hojaDeVidaId}>
                  <strong>{hv.titulo}</strong>: {hv.descripcion}
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* Sección izquierda */}
        <section className="left-section">
          <div className="box-left-perfil">
            <div className="perfil">
              <div className="profile-pic">
                <div className="overlay">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-photo"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7h4l2-3h6l2 3h4v13H3V7z"
                    />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
              <div className="text-perfil">
                <h1>
                  {aspirante?.nom} {aspirante?.ape}
                </h1>
                <p>{aspirante?.cargo || "Cargo no definido"}</p>
                <p>
                  Perfil completado <CheckCircle />
                </p>
              </div>
            </div>
            <div className="sub-text">
              <p>{aspirante?.descripcion || "Lorem ipsum dolor sit!"}</p>
              <h3>{aspirante?.resumen || "Resumen no disponible"}</h3>
            </div>
          </div>
        </section>

        {/* Sección derecha */}
        <section className="right-section">
          <div className="box-right-perfil">
            <h2>Información personal</h2>
            <p>
              <IdCard /> Documento: {aspirante?.numerDoc || "N/A"}
            </p>
            <p>
              <FaUser /> Tipo de documento: {aspirante?.nombreTipDoc || "N/A"}
            </p>
            <p>Municipio: {aspirante?.nombreMunicipio || "N/A"}</p>
            <p>Género: {aspirante?.nombreGenero || "N/A"}</p>
            <p>Teléfono: {aspirante?.tel || "N/A"}</p>
            <p>Ubicación: {aspirante?.ubi || "N/A"}</p>
            <p>
              Fecha de nacimiento:{" "}
              {aspirante?.feNa
                ? new Date(aspirante.feNa).toLocaleDateString()
                : "N/A"}
            </p>

            <h2>Opciones</h2>
            <ul className="menu-options">
              <li>
                <Link to="/editar-perfil">
                  <Settings /> Editar Perfil
                </Link>
              </li>
              <li>
                <Link to="/mis-ofertas">
                  <Rocket /> Mis Ofertas
                </Link>
              </li>
              <li>
                <Link to="/visualizar-perfil">
                  <Eye /> Ver Perfil Público
                </Link>
              </li>
            </ul>

            <div className="button-eliminar" onClick={handleEliminar}>
              ❌ Eliminar Cuenta
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MiPerfil;
