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
    salarioMin: "",
    salarioMax: "",
    ubicacion: "",
    fechaCierre: "",
    modalidad: "PRESENCIAL",
    tipoContrato: "TIEMPO_COMPLETO",
    nivelExperiencia: "SIN_EXPERIENCIA",
    municipioId: "",
  });

  const [municipios, setMunicipios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!ofertaId) {
      setError('No se especificó una oferta para editar');
      setCargando(false);
      return;
    }
    cargarDatos();
  }, [ofertaId]);

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
        salarioMin: ofertaData.salarioMin || "",
        salarioMax: ofertaData.salarioMax || "",
        ubicacion: ofertaData.ubicacion || "",
        fechaCierre: ofertaData.fechaCierre?.split('T')[0] || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setGuardando(true);
    try {
      const datosActualizados = {
        ...formData,
        municipio: { id: Number(formData.municipioId) }
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
              <label>NIT de la empresa (No editable)</label>
              <input
                type="text"
                disabled
                className="pb-input pb-disabled"
                value={formData.nitEmpresa}
              />
            </div>

            <div className="pb-field">
              <label htmlFor="tituloAviso">Título *</label>
              <input
                id="tituloAviso"
                name="tituloAviso"
                type="text"
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
                rows="4"
                value={formData.descripcionTrabajo}
                onChange={handleChange}
                required
                className="pb-textarea"
              />
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
              <label htmlFor="direccion">Dirección *</label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="fechaPublicacion">Fecha de publicación *</label>
              <input
                id="fechaPublicacion"
                name="fechaPublicacion"
                type="date"
                value={formData.fechaPublicacion}
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
              <label htmlFor="modalidadTrabajo">Modalidad *</label>
              <select
                id="modalidadTrabajo"
                name="modalidadTrabajo"
                value={formData.modalidadTrabajo}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona...</option>
                {modalidades.map((mod) => (
                  <option key={mod.id} value={mod.id}>{mod.nombre}</option>
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
                <option value="">Selecciona...</option>
                {tiposContrato.map((tc) => (
                  <option key={tc.id} value={tc.id}>{tc.nombre}</option>
                ))}
              </select>
            </div>

            <div classNAME="pb-field">
              <label htmlFor="municipio">Municipio *</label>
              <select
                id="municipio"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona...</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>{mun.nombre}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="pb-btn-primary">
              Guardar cambios
            </button>

          </section>
        </form>
      </main>
    </>
  );
};

export default EditarOfertaLaboral;
