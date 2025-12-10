import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import { crearOferta } from "../../../api/ofertasAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import "./PublicacionPage.css";

const PublicacionPage = () => {
  const navigate = useNavigate();

  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tituloAviso: "",
    descripcionTrabajo: "",
    salario: "",
    direccion: "",
    fechaLimite: "",
    modalidadTrabajo: "",
    tipoContrato: "",
    nivelExperiencia: "",
    municipio: "",
    empresaId: "",
  });

  useEffect(() => {
    const cargarMunicipios = async () => {
      try {
        const data = await getMunicipios();
        setMunicipios(data);
      } catch (error) {
        console.error("Error al cargar municipios:", error);
      }
    };
    cargarMunicipios();

    // Obtener empresa del reclutador actual desde localStorage o contexto
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.empresa?.id) {
          setFormData(prev => ({ ...prev, empresaId: user.empresa.id }));
        }
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  const modalidades = [
    { value: "PRESENCIAL", nombre: "Presencial" },
    { value: "REMOTO", nombre: "Remoto" },
    { value: "HIBRIDO", nombre: "Híbrido" }
  ];

  const tiposContrato = [
    { value: "TIEMPO_COMPLETO", nombre: "Tiempo completo" },
    { value: "MEDIO_TIEMPO", nombre: "Medio tiempo" },
    { value: "TEMPORAL", nombre: "Temporal" },
    { value: "FREELANCE", nombre: "Freelance" },
    { value: "PRACTICAS", nombre: "Prácticas" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.empresaId) {
      alert("No se encontró información de la empresa. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    try {
      const ofertaData = {
        titulo: formData.tituloAviso,
        descripcion: formData.descripcionTrabajo,
        salario: parseFloat(formData.salario),
        ubicacion: formData.direccion,
        fechaLimite: formData.fechaLimite,
        modalidad: formData.modalidadTrabajo,
        tipoContrato: formData.tipoContrato,
        nivelExperiencia: formData.nivelExperiencia,
        estadoOferta: "ABIERTA",
        empresa: {
          id: formData.empresaId
        },
        municipio: {
          id: parseInt(formData.municipio)
        }
      };

      console.log("Creando oferta:", ofertaData);
      const response = await crearOferta(ofertaData);
      console.log("Oferta creada:", response);

      alert("Oferta publicada exitosamente");
      
      // Resetear formulario
      setFormData({
        tituloAviso: "",
        descripcionTrabajo: "",
        salario: "",
        direccion: "",
        fechaLimite: "",
        modalidadTrabajo: "",
        tipoContrato: "",
        nivelExperiencia: "",
        municipio: "",
        empresaId: formData.empresaId // Mantener empresaId
      });

      navigate("/Reclutador/GestigOferts");

    } catch (error) {
      console.error("Error al crear oferta:", error);
      alert(`Error al publicar oferta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderReclutador />

      <main className="pb-container">
        <h1 className="pb-title">Publicar oferta</h1>

        <form className="pb-form" onSubmit={handleSubmit}>
          <section className="pb-card">
            <h2 className="pb-section-title">Datos de la oferta</h2>

            <div className="pb-field">
              <label htmlFor="tituloAviso">Título del aviso *</label>
              <input
                type="text"
                id="tituloAviso"
                name="tituloAviso"
                value={formData.tituloAviso}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="descripcionTrabajo">Descripción *</label>
              <textarea
                id="descripcionTrabajo"
                name="descripcionTrabajo"
                value={formData.descripcionTrabajo}
                onChange={handleChange}
                rows="4"
                required
                className="pb-textarea"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="salario">Salario *</label>
              <input
                type="number"
                id="salario"
                name="salario"
                value={formData.salario}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="fechaLimite">Fecha límite *</label>
              <input
                type="date"
                id="fechaLimite"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="modalidadTrabajo">Modalidad *</label>
              <select
                id="modalidadTrabajo"
                name="modalidadTrabajo"
                value={formData.modalidadTrabajo}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona una modalidad</option>
                {modalidades.map((mod) => (
                  <option key={mod.value} value={mod.value}>
                    {mod.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="pb-field">
              <label htmlFor="tipoContrato">Tipo de contrato *</label>
              <select
                id="tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona un tipo de contrato</option>
                {tiposContrato.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="pb-field">
              <label htmlFor="municipio">Municipio *</label>
              <select
                id="municipio"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona un municipio</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.nombre} - {mun.departamento?.nombre || ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="pb-field">
              <label htmlFor="nivelExperiencia">Nivel de experiencia *</label>
              <select
                id="nivelExperiencia"
                name="nivelExperiencia"
                value={formData.nivelExperiencia}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona un nivel</option>
                <option value="SIN_EXPERIENCIA">Sin experiencia</option>
                <option value="BASICO">Básico</option>
                <option value="INTERMEDIO">Intermedio</option>
                <option value="AVANZADO">Avanzado</option>
                <option value="EXPERTO">Experto</option>
              </select>
            </div>

            {/* 🔵 BOTÓN ACTUALIZADO */}
            <button className="pb-btn-primary" type="submit" disabled={loading}>
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </section>
        </form>
      </main>
    </>
  );
};

export default PublicacionPage;
