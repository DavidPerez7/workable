import React, { useEffect, useState } from "react";
import { getEmpresaById, actualizarEmpresa, eliminarEmpresa } from "../../../api/empresaAPI";
import { useNavigate } from "react-router-dom";

function EmpresaEditPage() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.empresaId) {
      setError("No tienes empresa asociada");
      setLoading(false);
      return;
    }
    getEmpresaById(user.empresaId)
      .then(data => setForm(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await actualizarEmpresa(form.id, form);
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar la empresa?")) return;
    setLoading(true);
    setError("");
    try {
      await eliminarEmpresa(form.id);
      navigate("/Reclutador/EnterprisePage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;
  if (!form) return null;

  return (
    <div className="empresa-edit-container">
      <h2>Editar empresa</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="nit" placeholder="NIT" value={form.nit} onChange={handleChange} required />
        <input name="municipioId" placeholder="ID Municipio" value={form.municipioId || ''} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion || ''} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono || ''} onChange={handleChange} />
        <input name="logo" placeholder="URL Logo" value={form.logo || ''} onChange={handleChange} />
        <input name="banner" placeholder="URL Banner" value={form.banner || ''} onChange={handleChange} />
        <input name="empresaCategoriaId" placeholder="ID Categoría" value={form.empresaCategoriaId || ''} onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion || ''} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
        <button type="button" onClick={handleDelete} style={{marginLeft:8, color:'red'}}>Eliminar Empresa</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
}

export default EmpresaEditPage;
