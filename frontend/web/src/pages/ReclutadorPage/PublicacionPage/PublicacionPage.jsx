import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { crearOferta } from "../../../api/ofertasAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import "./PublicacionPage.css";

const PublicacionPage = () => {
  const navigate = useNavigate();

  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    requisitos: "",
    salario: "",
    numeroVacantes: 1,
    fechaLimite: "",
    modalidad: "",
    tipoContrato: "",
    nivelExperiencia: "",
    municipioId: "",
    empresaId: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar municipios
        const municipiosData = await getMunicipios();
        setMunicipios(municipiosData);

        const reclutador = await reclutadoresApi.getMyProfile();
        if (reclutador?.empresa?.id) {
          setFormData((prev) => ({ ...prev, empresaId: reclutador.empresa.id }));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
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
    { value: "PRESTACION_SERVICIOS", nombre: "Prestación de servicios" },
    { value: "PRACTICAS", nombre: "Prácticas" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar campos obligatorios en frontend ANTES de enviar
    if (!formData.titulo?.trim()) {
      alert("El título es obligatorio");
      setLoading(false);
      return;
    }
    
    if (!formData.descripcion?.trim()) {
      alert("La descripción es obligatoria");
      setLoading(false);
      return;
    }
    
    if (!formData.requisitos?.trim()) {
      alert("Los requisitos son obligatorios");
      setLoading(false);
      return;
    }
    
    if (!formData.salario) {
      alert("El salario es obligatorio");
      setLoading(false);
      return;
    }
    
    if (!formData.fechaLimite) {
      alert("La fecha límite es obligatoria");
      setLoading(false);
      return;
    }
    
    if (!formData.modalidad) {
      alert("La modalidad es obligatoria");
      setLoading(false);
      return;
    }
    
    if (!formData.tipoContrato) {
      alert("El tipo de contrato es obligatorio");
      setLoading(false);
      return;
    }
    
    if (!formData.nivelExperiencia) {
      alert("El nivel de experiencia es obligatorio");
      setLoading(false);
      return;
    }

    if (!formData.empresaId) {
      alert("No se encontró información de la empresa. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    try {
      const ofertaData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        requisitos: formData.requisitos,
        salario: parseInt(formData.salario, 10),
        numeroVacantes: Number(formData.numeroVacantes || 1),
        fechaLimite: formData.fechaLimite,
        nivelExperiencia: formData.nivelExperiencia,
        modalidad: formData.modalidad,
        tipoContrato: formData.tipoContrato,
        estado: "ACTIVA",
        empresa: { id: formData.empresaId },
        municipio: formData.municipioId ? { id: parseInt(formData.municipioId, 10) } : null,
      };

      await crearOferta(ofertaData);
      alert("Oferta publicada exitosamente");

      setFormData((prev) => ({
        ...prev,
        titulo: "",
        descripcion: "",
        requisitos: "",
        salario: "",
        numeroVacantes: 1,
        fechaLimite: "",
        modalidad: "",
        tipoContrato: "",
        nivelExperiencia: "",
        municipioId: "",
      }));

      navigate("/Reclutador/GestigOferts");

    } catch (error) {
      console.error("Error completo:", error);
      alert(`Error al publicar oferta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderReclutador />
      <div className="reclutador-shell-RP">
        <SidebarReclutador />
        <main className="reclutador-main-RP">
          <section className="reclutador-card-RP">
            <div className="reclutador-card-header-RP">
              <div>
                <p className="reclutador-kicker-RP">Nueva oferta</p>
                <h2>Publicar oferta</h2>
              </div>
            </div>

            <form className="pb-form" onSubmit={handleSubmit}>
              <div className="pb-field">
                <label htmlFor="titulo">Titulo *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
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
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="pb-textarea"
                />
              </div>

              <div className="pb-field">
                <label htmlFor="requisitos">Requisitos *</label>
                <textarea
                  id="requisitos"
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleChange}
                  rows="3"
                  maxLength="500"
                  required
                  className="pb-textarea"
                />
              </div>

              <div className="pb-row">
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
                  <label htmlFor="numeroVacantes">Vacantes *</label>
                  <input
                    type="number"
                    id="numeroVacantes"
                    name="numeroVacantes"
                    value={formData.numeroVacantes}
                    onChange={handleChange}
                    min="1"
                    required
                    className="pb-input"
                  />
                </div>
              </div>

              <div className="pb-row">
                <div className="pb-field">
                  <label htmlFor="fechaLimite">Fecha limite *</label>
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
                      <option key={mun.id} value={mun.id}>
                        {mun.nombre} - {mun.departamento?.nombre || ""}
                      </option>
                    ))}
                  </select>
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
                    <option value="">Selecciona un tipo</option>
                    {tiposContrato.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <option value="BASICO">Basico</option>
                  <option value="INTERMEDIO">Intermedio</option>
                  <option value="AVANZADO">Avanzado</option>
                  <option value="EXPERTO">Experto</option>
                </select>
              </div>

              <button className="pb-btn-primary" type="submit" disabled={loading}>
                {loading ? "Publicando..." : "Publicar"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default PublicacionPage;
