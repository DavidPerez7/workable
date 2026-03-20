import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearEmpresa } from "../../../api/empresaAPI";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorFormField from "../../../components/reclutador/ReclutadorFormField";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
import "./EnterprisePage.css";

function EmpresaCreatePage() {
  const [form, setForm] = useState({
    nombre: "",
    nit: "",
    numeroTrabajadores: "",
    email: "",
    telefono: "",
    descripcion: "",
    logoUrl: "",
    municipioId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await crearEmpresa({
        nombre: form.nombre,
        nit: form.nit,
        numeroTrabajadores: Number(form.numeroTrabajadores || 1),
        email: form.email,
        telefono: form.telefono,
        descripcion: form.descripcion,
        logoUrl: form.logoUrl || null,
        categories: ["TECNOLOGIA"],
        municipio: { id: Number(form.municipioId) },
      });
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      setError(err.message || "No se pudo crear la empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReclutadorLayout>
      <ReclutadorCard>
        <ReclutadorSectionHeader kicker="Empresa" title="Crear empresa" />
        <form className="empresa-form-RP" onSubmit={handleSubmit}>
          <div className="empresa-row-RP">
            <ReclutadorFormField label="Nombre *" htmlFor="nombre">
              <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="NIT *" htmlFor="nit">
              <input id="nit" name="nit" value={form.nit} onChange={handleChange} required className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>
          <div className="empresa-row-RP">
            <ReclutadorFormField label="Numero trabajadores *" htmlFor="numeroTrabajadores">
              <input id="numeroTrabajadores" name="numeroTrabajadores" value={form.numeroTrabajadores} onChange={handleChange} required className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="Email *" htmlFor="email">
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>
          <div className="empresa-row-RP">
            <ReclutadorFormField label="Telefono *" htmlFor="telefono">
              <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} required className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="Logo (URL)" htmlFor="logoUrl">
              <input id="logoUrl" name="logoUrl" value={form.logoUrl} onChange={handleChange} className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>
          <ReclutadorFormField label="Municipio ID *" htmlFor="municipioId">
            <input id="municipioId" name="municipioId" value={form.municipioId} onChange={handleChange} required className="reclutador-input-RP" />
          </ReclutadorFormField>
          <ReclutadorFormField label="Descripcion *" htmlFor="descripcion">
            <textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} rows="4" required className="reclutador-textarea-RP" />
          </ReclutadorFormField>
          <ReclutadorButton type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear empresa"}
          </ReclutadorButton>
          {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}
        </form>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
}

export default EmpresaCreatePage;
