import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { crearEmpresa } from "../../api/empresaAPI";
import { getMunicipios } from "../../api/municipioAPI";
import ReclutadorButton from "./ReclutadorButton";
import ReclutadorFormField from "./ReclutadorFormField";
import "./CrearEmpresaModal.css";

const CrearEmpresaModal = ({ isOpen, onClose, onSuccess }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const cargarMunicipios = async () => {
        try {
          const data = await getMunicipios();
          setMunicipios(data);
        } catch (error) {
          console.error("Error al cargar municipios:", error);
        }
      };
      cargarMunicipios();
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const camposRequeridos = [
      "nombre",
      "nit",
      "numeroTrabajadores",
      "email",
      "telefono",
      "descripcion",
      "municipioId",
    ];

    const faltantes = camposRequeridos.filter((campo) => !data[campo]);

    if (faltantes.length > 0) {
      alert("Todos los campos marcados con * son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      await crearEmpresa(data);
      alert("Empresa registrada exitosamente.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al registrar empresa:", error);
      alert("Error al registrar empresa. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-CEM">
      <div className="modal-content-CEM">
        <div className="modal-header-CEM">
          <h2>Registrar Empresa</h2>
          <button onClick={onClose} className="modal-close-CEM">
            <X size={24} />
          </button>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="modal-form-CEM">
          <ReclutadorFormField
            label="Nombre de la empresa *"
            name="nombre"
            type="text"
            placeholder="Ingresa el nombre de la empresa"
            required
          />
          <ReclutadorFormField
            label="NIT *"
            name="nit"
            type="text"
            placeholder="Ingresa el NIT"
            required
          />
          <ReclutadorFormField
            label="Número de trabajadores *"
            name="numeroTrabajadores"
            type="number"
            placeholder="Ingresa el número de trabajadores"
            required
          />
          <ReclutadorFormField
            label="Email *"
            name="email"
            type="email"
            placeholder="Ingresa el email de la empresa"
            required
          />
          <ReclutadorFormField
            label="Teléfono *"
            name="telefono"
            type="tel"
            placeholder="Ingresa el teléfono"
            required
          />
          <ReclutadorFormField
            label="Descripción *"
            name="descripcion"
            type="textarea"
            placeholder="Describe la empresa"
            required
          />
          <div className="form-field-CEM">
            <label>Municipio *</label>
            <select name="municipioId" required>
              <option value="">Selecciona un municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions-CEM">
            <ReclutadorButton type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </ReclutadorButton>
            <ReclutadorButton type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Empresa"}
            </ReclutadorButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearEmpresaModal;