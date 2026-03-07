import React, { useEffect, useState } from "react";
import { getEmpresaById, actualizarEmpresa, eliminarEmpresa } from "../../../api/empresaAPI";
import { useNavigate } from "react-router-dom";
import "./EmpresaEditPage.css";

function EmpresaEditPage() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.empresaId) {
      setError("No tienes empresa asociada");
      setLoading(false);
      return;
    }
    getEmpresaById(user.empresaId)
      .then(data => {
        setForm(data);
        setError("");
      })
      .catch(err => {
        setError("Error al cargar la empresa: " + (err.response?.data?.message || err.message));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!form.nombre || form.nombre.trim() === '') {
      setError("El nombre es requerido");
      return;
    }
    if (!form.nit || form.nit.trim() === '') {
      setError("El NIT es requerido");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await actualizarEmpresa(form.id, form);
      setSuccess("Empresa actualizada correctamente");
      setTimeout(() => {
        navigate("/Reclutador/EnterprisePage");
      }, 1500);
    } catch (err) {
      setError("Error al actualizar: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.")) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await eliminarEmpresa(form.id);
      setSuccess("Empresa eliminada correctamente");
      setTimeout(() => {
        navigate("/Reclutador/EnterprisePage");
      }, 1500);
    } catch (err) {
      setError("Error al eliminar: " + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/Reclutador/EnterprisePage");
  };

  if (loading) {
    return (
      <div className="empresa-edit-container">
        <div className="loading-state">
          <p>Cargando información de la empresa...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="empresa-edit-container">
        <div className="error-state">
          <p>Error: No se pudo cargar la empresa</p>
          <button onClick={handleCancel}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="empresa-edit-container">
      <div className="edit-header">
        <h1>Editar Información de la Empresa</h1>
        <p className="subtitle">Actualiza los datos de tu empresa</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError("")}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="empresa-form">
        {/* Primera fila: Nombre y NIT */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Empresa *</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={form.nombre || ''}
              onChange={handleChange}
              placeholder="Ej: Tech Solutions S.A."
              required
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nit">NIT *</label>
            <input
              id="nit"
              type="text"
              name="nit"
              value={form.nit || ''}
              onChange={handleChange}
              placeholder="Ej: 9292992929"
              required
              disabled={true}
              title="El NIT no puede ser modificado"
            />
            <small className="form-hint">El NIT no puede ser modificado</small>
          </div>
        </div>

        {/* Segunda fila: Razón Social y Número de Trabajadores */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="razonSocial">Razón Social</label>
            <input
              id="razonSocial"
              type="text"
              name="razonSocial"
              value={form.razonSocial || ''}
              onChange={handleChange}
              placeholder="Ej: Sociedad Anónima"
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="numeroTrabajadores">Número de Trabajadores</label>
            <input
              id="numeroTrabajadores"
              type="number"
              name="numeroTrabajadores"
              value={form.numeroTrabajadores || ''}
              onChange={handleChange}
              placeholder="Ej: 50"
              min="1"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Tercera fila: Email y Teléfono */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="correo">Email de Contacto</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={form.correo || ''}
              onChange={handleChange}
              placeholder="Ej: contacto@empresa.com"
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              name="telefono"
              value={form.telefono || ''}
              onChange={handleChange}
              placeholder="Ej: 6015551234"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Cuarta fila: Dirección */}
        <div className="form-row full-width">
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              type="text"
              name="direccion"
              value={form.direccion || ''}
              onChange={handleChange}
              placeholder="Ej: Calle 123 #45-67"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Quinta fila: Website y Logo */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="website">Sitio Web</label>
            <input
              id="website"
              type="url"
              name="website"
              value={form.website || ''}
              onChange={handleChange}
              placeholder="Ej: https://www.empresa.com"
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="logo">URL del Logo</label>
            <input
              id="logo"
              type="url"
              name="logo"
              value={form.logo || ''}
              onChange={handleChange}
              placeholder="Ej: https://..."
              disabled={submitting}
            />
          </div>
        </div>

        {/* Sexta fila: Banner y Municipio */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="banner">URL del Banner</label>
            <input
              id="banner"
              type="url"
              name="banner"
              value={form.banner || ''}
              onChange={handleChange}
              placeholder="Ej: https://..."
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="municipioId">ID Municipio</label>
            <input
              id="municipioId"
              type="number"
              name="municipioId"
              value={form.municipioId || ''}
              onChange={handleChange}
              placeholder="Ej: 76"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="form-row full-width">
          <div className="form-group">
            <label htmlFor="descripcion">Descripción de la Empresa</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion || ''}
              onChange={handleChange}
              placeholder="Describe tu empresa, misión, visión y valores..."
              rows="5"
              maxLength="1000"
              disabled={submitting}
            />
            <small className="form-hint">
              {(form.descripcion || '').length}/1000 caracteres
            </small>
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={submitting}
            title="Eliminar esta empresa permanentemente"
          >
            Eliminar Empresa
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmpresaEditPage;
