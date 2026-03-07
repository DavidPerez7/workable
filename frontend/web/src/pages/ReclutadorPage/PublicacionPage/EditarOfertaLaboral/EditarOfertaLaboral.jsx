import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOfertaById, actualizarOferta } from "../../../../api/ofertasAPI";
import { getMunicipios } from "../../../../api/municipioAPI";
import HeaderReclutador from "../../../../components/HeaderReclutador/HeaderReclutador";
import "./EditarOfertaLaboral.css";

const EditarOfertaLaboral = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ofertaId = location.state?.ofertaId;

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    requisitos: "",
    salario: "",
    fechaLimite: "",
    modalidad: "PRESENCIAL",
    tipoContrato: "TIEMPO_COMPLETO",
    nivelExperiencia: "SIN_EXPERIENCIA",
    municipioId: "",
  });

  const [municipios, setMunicipios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const modalidades = [
    { value: "PRESENCIAL", nombre: "Presencial" },
    { value: "REMOTO", nombre: "Remoto" },
    { value: "HIBRIDO", nombre: "Híbrido" }
  ];

  const tiposContrato = [
    { value: "TIEMPO_COMPLETO", nombre: "Tiempo completo" },
    { value: "MEDIO_TIEMPO", nombre: "Medio tiempo" },
    { value: "TEMPORAL", nombre: "Temporal" },
    { value: "PRESTACION_SERVICIOS", nombre: "Prestación de servicios" },
    { value: "PRACTICAS", nombre: "Prácticas" },
  ];

  const nivelesExperiencia = [
    { value: "SIN_EXPERIENCIA", nombre: "Sin experiencia" },
    { value: "BASICO", nombre: "Básico" },
    { value: "INTERMEDIO", nombre: "Intermedio" },
    { value: "AVANZADO", nombre: "Avanzado" },
    { value: "EXPERTO", nombre: "Experto" },
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        const [ofertaData, municipiosData] = await Promise.all([
          getOfertaById(ofertaId),
          getMunicipios()
        ]);

        setMunicipios(municipiosData);
        setFormData({
          titulo: ofertaData.titulo || "",
          descripcion: ofertaData.descripcion || "",
          requisitos: ofertaData.requisitos || "",
          salario: ofertaData.salario || "",
          fechaLimite: ofertaData.fechaLimite?.split('T')[0] || "",
          modalidad: ofertaData.modalidad || "PRESENCIAL",
          tipoContrato: ofertaData.tipoContrato || "TIEMPO_COMPLETO",
          nivelExperiencia: ofertaData.nivelExperiencia || "SIN_EXPERIENCIA",
          municipioId: ofertaData.municipio?.id || "",
        });
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(err.message || 'Error al cargar la oferta');
      } finally {
        setCargando(false);
      }
    };

    if (!ofertaId) {
      setError('No se especificó una oferta para editar');
      setCargando(false);
      return;
    }
    cargarDatos();
  }, [ofertaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setGuardando(true);
    try {
      const datosActualizados = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        requisitos: formData.requisitos,
        salario: parseInt(formData.salario, 10),
        fechaLimite: formData.fechaLimite,
        modalidad: formData.modalidad,
        tipoContrato: formData.tipoContrato,
        nivelExperiencia: formData.nivelExperiencia,
        municipio: formData.municipioId ? { id: parseInt(formData.municipioId, 10) } : null
      };

      await actualizarOferta(ofertaId, datosActualizados);
      alert("Oferta actualizada exitosamente ✔");
      navigate("/Reclutador/GestigOferts");
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert(`Error al actualizar la oferta: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <>
        <HeaderReclutador />
        <main className="pb-container">
          <p className="pb-loading">Cargando datos...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderReclutador />
        <main className="pb-container">
          <p className="pb-error">{error}</p>
          <button onClick={() => navigate("/Reclutador/GestigOferts")}>Volver</button>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />

      <main className="pb-container">
        <h1 className="pb-title">Editar oferta laboral</h1>

        <form className="pb-form" onSubmit={handleSubmit}>
          <section className="pb-card">

            <h2 className="pb-section-title">Información de la oferta</h2>

            <div className="pb-field">
              <label htmlFor="titulo">Título *</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
                required
                className="pb-textarea"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="requisitos">Requisitos * (máximo 500 caracteres)</label>
              <textarea
                id="requisitos"
                name="requisitos"
                rows="3"
                maxLength="500"
                value={formData.requisitos}
                onChange={handleChange}
                required
                className="pb-textarea"
                placeholder="Ej: 2 años de experiencia en programación, conocimiento en React, etc."
              />
              <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
                {formData.requisitos.length}/500 caracteres
              </small>
            </div>

            <div className="pb-field">
              <label htmlFor="salario">Salario *</label>
              <input
                id="salario"
                name="salario"
                type="number"
                value={formData.salario}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="fechaLimite">Fecha límite *</label>
              <input
                id="fechaLimite"
                name="fechaLimite"
                type="date"
                value={formData.fechaLimite}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="modalidad">Modalidad *</label>
              <select
                id="modalidad"
                name="modalidad"
                value={formData.modalidad}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona una modalidad</option>
                {modalidades.map((mod) => (
                  <option key={mod.value} value={mod.value}>{mod.nombre}</option>
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
                {tiposContrato.map((tc) => (
                  <option key={tc.value} value={tc.value}>{tc.nombre}</option>
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
                {nivelesExperiencia.map((nivel) => (
                  <option key={nivel.value} value={nivel.value}>{nivel.nombre}</option>
                ))}
              </select>
            </div>

            <div className="pb-field">
              <label htmlFor="municipioId">Municipio *</label>
              <select
                id="municipioId"
                name="municipioId"
                value={formData.municipioId}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona un municipio</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>{mun.nombre} - {mun.departamento?.nombre || ''}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="pb-btn-primary" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>

          </section>
        </form>
      </main>
    </>
  );
};

export default EditarOfertaLaboral;
