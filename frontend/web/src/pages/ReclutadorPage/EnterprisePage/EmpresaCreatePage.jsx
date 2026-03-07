import React, { useState } from "react";
import { crearEmpresa } from "../../../api/empresaAPI";
import { useNavigate } from "react-router-dom";

function EmpresaCreatePage() {
  const [form, setForm] = useState({
    nombre: "",
    nit: "",
    municipioId: "",
    direccion: "",
    telefono: "",
    descripcion: "",
    logo: "",
    banner: "",
    empresaCategoriaId: ""
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
      await crearEmpresa(form);
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="empresa-create-container">
      <h2>Registrar nueva empresa</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="nit" placeholder="NIT" value={form.nit} onChange={handleChange} required />
        <input name="municipioId" placeholder="ID Municipio" value={form.municipioId} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="logo" placeholder="URL Logo" value={form.logo} onChange={handleChange} />
        <input name="banner" placeholder="URL Banner" value={form.banner} onChange={handleChange} />
        <input name="empresaCategoriaId" placeholder="ID Categoría" value={form.empresaCategoriaId} onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear Empresa"}</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
}

export default EmpresaCreatePage;
