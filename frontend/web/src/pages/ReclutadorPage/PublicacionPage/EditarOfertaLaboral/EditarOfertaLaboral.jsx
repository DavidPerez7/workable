import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOfertaById, actualizarOferta } from "../../../../api/ofertasAPI";
import { getMunicipios } from "../../../../api/municipioAPI";
import HeaderReclutador from "../../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../../components/SidebarReclutador/SidebarReclutador";
import "./EditarOfertaLaboral.css";

const EditarOfertaLaboral = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const ofertaId = location.state?.ofertaId || params.get("ofertaId");

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
        const modalidad = ofertaData.modalidad?.nombre || ofertaData.modalidad || "PRESENCIAL";
        const tipoContrato = ofertaData.tipoContrato?.nombre || ofertaData.tipoContrato || "TIEMPO_COMPLETO";
        const nivelExperiencia =
          ofertaData.nivelExperiencia?.nombre || ofertaData.nivelExperiencia || "SIN_EXPERIENCIA";

        setFormData({
          titulo: ofertaData.titulo || "",
          descripcion: ofertaData.descripcion || "",
          requisitos: ofertaData.requisitos || "",
          salario: ofertaData.salario || "",
          fechaLimite: ofertaData.fechaLimite?.split("T")[0] || "",
          modalidad,
          tipoContrato,
          nivelExperiencia,
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
        <main className="reclutador-main-RP">
          <div className="reclutador-card-RP">Cargando datos...</div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderReclutador />
        <main className="reclutador-main-RP">
          <div className="reclutador-card-RP">
            <p className="reclutador-alert-RP error">{error}</p>
            <button onClick={() => navigate("/Reclutador/GestigOferts")} className="reclutador-button-RP">
              Volver
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Editar oferta</p>
                <h2>Actualiza la oferta</h2>
              </div>
            </div>

            <form className="pb-form" onSubmit={handleSubmit}>
              <div className="pb-field">
                <label htmlFor="titulo">Titulo *</label>
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
                <label htmlFor="descripcion">Descripcion *</label>
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
                <label htmlFor="requisitos">Requisitos *</label>
                <textarea
                  id="requisitos"
                  name="requisitos"
                  rows="3"
                  maxLength="500"
                  value={formData.requisitos}
                  onChange={handleChange}
                  required
                  className="pb-textarea"
                />
              </div>

              <div className="pb-row">
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
                  <label htmlFor="fechaLimite">Fecha limite *</label>
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
              </div>

              <div className="pb-row">
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
                    <option value="">Selecciona un tipo</option>
                    {tiposContrato.map((tc) => (
                      <option key={tc.value} value={tc.value}>{tc.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pb-row">
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
                      <option key={mun.id} value={mun.id}>{mun.nombre} - {mun.departamento?.nombre || ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="pb-btn-primary" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default EditarOfertaLaboral;
