import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import { crearOferta } from "../../../api/ofertasAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import "./PublicacionPage.css";

const PublicacionPage = () => {
  const navigate = useNavigate();

  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tituloAviso: "",
    descripcionTrabajo: "",
    requisitos: "",
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
    const cargarDatos = async () => {
      try {
        // Cargar municipios
        const municipiosData = await getMunicipios();
        setMunicipios(municipiosData);

        // Obtener empresaId desde localStorage (actualizado por RegistrarEmpresa)
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.empresa?.id || user?.empresaId) {
          const empresaId = user.empresa?.id || user.empresaId;
          setFormData(prev => ({ ...prev, empresaId }));
        } else {
          // Fallback: intentar obtener desde getMyProfile
          try {
            const reclutador = await reclutadoresApi.getMyProfile();
            if (reclutador?.empresa?.id) {
              setFormData(prev => ({ ...prev, empresaId: reclutador.empresa.id }));
            }
          } catch (err) {
            console.warn("No se pudo obtener empresa desde getMyProfile:", err);
          }
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
    if (!formData.tituloAviso?.trim()) {
      alert("El título es obligatorio");
      setLoading(false);
      return;
    }
    
    if (!formData.descripcionTrabajo?.trim()) {
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
    
    if (!formData.modalidadTrabajo) {
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
        titulo: formData.tituloAviso,
        descripcion: formData.descripcionTrabajo,
        requisitos: formData.requisitos,
        salario: parseInt(formData.salario, 10),
        numeroVacantes: 1,
        fechaLimite: formData.fechaLimite,
        nivelExperiencia: formData.nivelExperiencia,
        modalidad: formData.modalidadTrabajo,
        tipoContrato: formData.tipoContrato,
        estado: "ABIERTA",
        empresa: { id: formData.empresaId },
        municipio: formData.municipio ? { id: parseInt(formData.municipio, 10) } : null,
        beneficios: []
      };

      console.log("=== OFERTA A ENVIAR ===");
      console.log(JSON.stringify(ofertaData, null, 2));
      
      const response = await crearOferta(ofertaData);
      console.log("Oferta creada:", response);

      alert("Oferta publicada exitosamente");
      
      // Resetear formulario
      setFormData({
        tituloAviso: "",
        descripcionTrabajo: "",
        requisitos: "",
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
      console.error("Error completo:", error);
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
              <label htmlFor="requisitos">Requisitos * (máximo 500 caracteres)</label>
              <textarea
                id="requisitos"
                name="requisitos"
                value={formData.requisitos}
                onChange={handleChange}
                rows="3"
                maxLength="500"
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
