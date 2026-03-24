import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getOfertaById, actualizarOferta } from "../../../api/ofertasAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import ReclutadorCard from "../../reclutador/ReclutadorCard";
import ReclutadorButton from "../../reclutador/ReclutadorButton";
import "./OfertaEditarModal.css";

const modalidades = [
  { value: "PRESENCIAL", nombre: "Presencial" },
  { value: "REMOTO", nombre: "Remoto" },
  { value: "HIBRIDO", nombre: "Híbrido" },
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

const createInitialForm = (oferta = null) => ({
  titulo: oferta?.titulo || "",
  descripcion: oferta?.descripcion || "",
  requisitos: oferta?.requisitos || "",
  salario: oferta?.salario || "",
  fechaLimite: oferta?.fechaLimite?.split("T")[0] || "",
  modalidad: oferta?.modalidad?.nombre || oferta?.modalidad || "PRESENCIAL",
  tipoContrato: oferta?.tipoContrato?.nombre || oferta?.tipoContrato || "TIEMPO_COMPLETO",
  nivelExperiencia: oferta?.nivelExperiencia?.nombre || oferta?.nivelExperiencia || "SIN_EXPERIENCIA",
  municipioId: oferta?.municipio?.id || "",
});

function OfertaEditarModal({ isOpen, ofertaId, ofertaInicial = null, onClose, onSaved }) {
  const [formData, setFormData] = useState(() => createInitialForm(ofertaInicial));
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let activo = true;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");

        const [ofertaData, municipiosData] = await Promise.all([
          ofertaId ? getOfertaById(ofertaId) : Promise.resolve(ofertaInicial),
          getMunicipios(),
        ]);

        if (!activo) {
          return;
        }

        setMunicipios(Array.isArray(municipiosData) ? municipiosData : []);
        setFormData(createInitialForm(ofertaData || ofertaInicial));
      } catch (err) {
        if (!activo) {
          return;
        }

        console.error("Error cargando oferta para edición:", err);
        setError(err.message || "No se pudo cargar la oferta");
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [isOpen, ofertaId, ofertaInicial]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const datosActualizados = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        requisitos: formData.requisitos,
        salario: Number.parseInt(formData.salario, 10),
        fechaLimite: formData.fechaLimite,
        modalidad: formData.modalidad,
        tipoContrato: formData.tipoContrato,
        nivelExperiencia: formData.nivelExperiencia,
        municipio: formData.municipioId ? { id: Number.parseInt(formData.municipioId, 10) } : null,
      };

      await actualizarOferta(ofertaId, datosActualizados);
      if (onSaved) {
        await onSaved();
      }
      onClose();
    } catch (err) {
      console.error("Error al actualizar oferta:", err);
      setError(err.message || "Error al actualizar la oferta");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="oferta-modal-overlay-EP" role="dialog" aria-modal="true">
      <ReclutadorCard className="oferta-modal-card-EP">
        <div className="oferta-modal-header-EP">
          <div>
            <p className="oferta-modal-kicker-EP">Editar oferta</p>
            <h2>Actualiza la oferta</h2>
          </div>
          <button type="button" className="oferta-modal-close-EP" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="oferta-modal-loading-EP">Cargando datos...</div>
        ) : error ? (
          <div className="oferta-modal-error-EP">{error}</div>
        ) : (
          <form className="pb-form" onSubmit={handleSubmit}>
            <div className="pb-field">
              <label htmlFor="titulo">Titulo *</label>
              <input id="titulo" name="titulo" type="text" value={formData.titulo} onChange={handleChange} required className="pb-input" />
            </div>

            <div className="pb-field">
              <label htmlFor="descripcion">Descripcion *</label>
              <textarea id="descripcion" name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange} required className="pb-textarea" />
            </div>

            <div className="pb-field">
              <label htmlFor="requisitos">Requisitos *</label>
              <textarea id="requisitos" name="requisitos" rows="3" maxLength="500" value={formData.requisitos} onChange={handleChange} required className="pb-textarea" />
            </div>

            <div className="pb-row">
              <div className="pb-field">
                <label htmlFor="salario">Salario *</label>
                <input id="salario" name="salario" type="number" value={formData.salario} onChange={handleChange} required className="pb-input" />
              </div>
              <div className="pb-field">
                <label htmlFor="fechaLimite">Fecha limite *</label>
                <input id="fechaLimite" name="fechaLimite" type="date" value={formData.fechaLimite} onChange={handleChange} required className="pb-input" />
              </div>
            </div>

            <div className="pb-row">
              <div className="pb-field">
                <label htmlFor="modalidad">Modalidad *</label>
                <select id="modalidad" name="modalidad" value={formData.modalidad} onChange={handleChange} required className="pb-select">
                  <option value="">Selecciona una modalidad</option>
                  {modalidades.map((mod) => (
                    <option key={mod.value} value={mod.value}>{mod.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="pb-field">
                <label htmlFor="tipoContrato">Tipo de contrato *</label>
                <select id="tipoContrato" name="tipoContrato" value={formData.tipoContrato} onChange={handleChange} required className="pb-select">
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
                <select id="nivelExperiencia" name="nivelExperiencia" value={formData.nivelExperiencia} onChange={handleChange} required className="pb-select">
                  <option value="">Selecciona un nivel</option>
                  {nivelesExperiencia.map((nivel) => (
                    <option key={nivel.value} value={nivel.value}>{nivel.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="pb-field">
                <label htmlFor="municipioId">Municipio *</label>
                <select id="municipioId" name="municipioId" value={formData.municipioId} onChange={handleChange} required className="pb-select">
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>{municipio.nombre} - {municipio.departamento?.nombre || ""}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="oferta-modal-actions-EP">
              <ReclutadorButton type="button" variant="secondary" onClick={onClose} disabled={saving}>
                Cancelar
              </ReclutadorButton>
              <ReclutadorButton type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </ReclutadorButton>
            </div>
          </form>
        )}
      </ReclutadorCard>
    </div>
  );
}

export default OfertaEditarModal;