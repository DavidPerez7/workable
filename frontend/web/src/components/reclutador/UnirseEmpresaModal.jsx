import React, { useState } from "react";
import { X } from "lucide-react";
import reclutadoresApi from "../../api/reclutadoresApi";
import ReclutadorButton from "./ReclutadorButton";
import ReclutadorFormField from "./ReclutadorFormField";
import "./UnirseEmpresaModal.css";

const UnirseEmpresaModal = ({ isOpen, onClose, onSuccess }) => {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!codigo.trim()) {
      alert("Ingresa el código de la empresa.");
      return;
    }

    setLoading(true);
    try {
      await reclutadoresApi.updateByCode(codigo.trim());
      alert("Te has unido a la empresa exitosamente.");
      onSuccess();
      onClose();
      setCodigo("");
    } catch (error) {
      console.error("Error al unirse a la empresa:", error);
      alert("Error al unirse a la empresa. Verifica el código.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-UEM">
      <div className="modal-content-UEM">
        <div className="modal-header-UEM">
          <h2>Unirse a Empresa</h2>
          <button onClick={onClose} className="modal-close-UEM">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form-UEM">
          <ReclutadorFormField
            label="Código de la empresa"
            name="codigo"
            type="text"
            placeholder="Ingresa el código de la empresa"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <div className="modal-actions-UEM">
            <ReclutadorButton type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </ReclutadorButton>
            <ReclutadorButton type="submit" disabled={loading}>
              {loading ? "Uniéndose..." : "Unirse a Empresa"}
            </ReclutadorButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnirseEmpresaModal;