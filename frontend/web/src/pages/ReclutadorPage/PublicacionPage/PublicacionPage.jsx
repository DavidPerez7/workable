import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearOferta } from "../../../api/ofertasAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorFormField from "../../../components/reclutador/ReclutadorFormField";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";

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

  const nivelesExperiencia = [
    { value: "SIN_EXPERIENCIA", nombre: "Sin experiencia" },
    { value: "BASICO", nombre: "Basico" },
    { value: "INTERMEDIO", nombre: "Intermedio" },
    { value: "AVANZADO", nombre: "Avanzado" },
    { value: "EXPERTO", nombre: "Experto" },
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
    <ReclutadorLayout>
      <ReclutadorCard>
        <ReclutadorSectionHeader kicker="Nueva oferta" title="Publicar oferta" />

        <form className="reclutador-form-RP" onSubmit={handleSubmit}>
          <ReclutadorFormField label="Titulo *" htmlFor="titulo">
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="reclutador-input-RP"
            />
          </ReclutadorFormField>

          <ReclutadorFormField label="Descripcion *" htmlFor="descripcion">
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              required
              className="reclutador-textarea-RP"
            />
          </ReclutadorFormField>

          <ReclutadorFormField label="Requisitos *" htmlFor="requisitos">
            <textarea
              id="requisitos"
              name="requisitos"
              value={formData.requisitos}
              onChange={handleChange}
              rows="3"
              maxLength="500"
              required
              className="reclutador-textarea-RP"
            />
          </ReclutadorFormField>

          <div className="reclutador-form-grid-RP">
            <ReclutadorFormField label="Salario *" htmlFor="salario">
              <input
                type="number"
                id="salario"
                name="salario"
                value={formData.salario}
                onChange={handleChange}
                required
                className="reclutador-input-RP"
              />
            </ReclutadorFormField>
            <ReclutadorFormField label="Vacantes *" htmlFor="numeroVacantes">
              <input
                type="number"
                id="numeroVacantes"
                name="numeroVacantes"
                value={formData.numeroVacantes}
                onChange={handleChange}
                min="1"
                required
                className="reclutador-input-RP"
              />
            </ReclutadorFormField>
          </div>

          <div className="reclutador-form-grid-RP">
            <ReclutadorFormField label="Fecha limite *" htmlFor="fechaLimite">
              <input
                type="date"
                id="fechaLimite"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                required
                className="reclutador-input-RP"
              />
            </ReclutadorFormField>
            <ReclutadorFormField label="Municipio *" htmlFor="municipioId">
              <select
                id="municipioId"
                name="municipioId"
                value={formData.municipioId}
                onChange={handleChange}
                required
                className="reclutador-select-RP"
              >
                <option value="">Selecciona un municipio</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.nombre} - {mun.departamento?.nombre || ""}
                  </option>
                ))}
              </select>
            </ReclutadorFormField>
          </div>

          <div className="reclutador-form-grid-RP">
            <ReclutadorFormField label="Modalidad *" htmlFor="modalidad">
              <select
                id="modalidad"
                name="modalidad"
                value={formData.modalidad}
                onChange={handleChange}
                required
                className="reclutador-select-RP"
              >
                <option value="">Selecciona una modalidad</option>
                {modalidades.map((mod) => (
                  <option key={mod.value} value={mod.value}>
                    {mod.nombre}
                  </option>
                ))}
              </select>
            </ReclutadorFormField>
            <ReclutadorFormField label="Tipo de contrato *" htmlFor="tipoContrato">
              <select
                id="tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleChange}
                required
                className="reclutador-select-RP"
              >
                <option value="">Selecciona un tipo</option>
                {tiposContrato.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </ReclutadorFormField>
          </div>

          <ReclutadorFormField label="Nivel de experiencia *" htmlFor="nivelExperiencia">
            <select
              id="nivelExperiencia"
              name="nivelExperiencia"
              value={formData.nivelExperiencia}
              onChange={handleChange}
              required
              className="reclutador-select-RP"
            >
              <option value="">Selecciona un nivel</option>
              {nivelesExperiencia.map((nivel) => (
                <option key={nivel.value} value={nivel.value}>
                  {nivel.nombre}
                </option>
              ))}
            </select>
          </ReclutadorFormField>

          <ReclutadorButton type="submit" disabled={loading}>
            {loading ? "Publicando..." : "Publicar"}
          </ReclutadorButton>
        </form>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
};

export default PublicacionPage;
