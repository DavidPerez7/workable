import React, { useEffect, useState } from "react";
import { getEmpresaById, actualizarEmpresa, eliminarEmpresa } from "../../../api/empresaAPI";
import { useNavigate } from "react-router-dom";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorFormField from "../../../components/reclutador/ReclutadorFormField";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
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
      <ReclutadorLayout>
        <ReclutadorCard>Cargando información de la empresa...</ReclutadorCard>
      </ReclutadorLayout>
    );
  }

  if (!form) {
    return (
      <ReclutadorLayout>
        <ReclutadorCard>
          <p>Error: No se pudo cargar la empresa</p>
          <ReclutadorButton type="button" onClick={handleCancel}>Volver</ReclutadorButton>
        </ReclutadorCard>
      </ReclutadorLayout>
    );
  }

  return (
    <ReclutadorLayout>
      <ReclutadorCard>
        <ReclutadorSectionHeader kicker="Empresa" title="Editar Información de la Empresa" subtitle="Actualiza los datos de tu empresa" />

      {error ? <ReclutadorAlert>{error}</ReclutadorAlert> : null}

      {success ? <ReclutadorAlert type="success">{success}</ReclutadorAlert> : null}

        <form onSubmit={handleSubmit} className="empresa-form">
          <div className="form-row">
            <ReclutadorFormField label="Nombre de la Empresa *" htmlFor="nombre">
              <input id="nombre" type="text" name="nombre" value={form.nombre || ''} onChange={handleChange} placeholder="Ej: Tech Solutions S.A." required disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="NIT *" htmlFor="nit" hint="El NIT no puede ser modificado">
              <input id="nit" type="text" name="nit" value={form.nit || ''} onChange={handleChange} placeholder="Ej: 9292992929" required disabled className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <div className="form-row">
            <ReclutadorFormField label="Razón Social" htmlFor="razonSocial">
              <input id="razonSocial" type="text" name="razonSocial" value={form.razonSocial || ''} onChange={handleChange} placeholder="Ej: Sociedad Anónima" disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="Número de Trabajadores" htmlFor="numeroTrabajadores">
              <input id="numeroTrabajadores" type="number" name="numeroTrabajadores" value={form.numeroTrabajadores || ''} onChange={handleChange} placeholder="Ej: 50" min="1" disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <div className="form-row">
            <ReclutadorFormField label="Email de Contacto" htmlFor="correo">
              <input id="correo" type="email" name="correo" value={form.correo || ''} onChange={handleChange} placeholder="Ej: contacto@empresa.com" disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="Teléfono" htmlFor="telefono">
              <input id="telefono" type="tel" name="telefono" value={form.telefono || ''} onChange={handleChange} placeholder="Ej: 6015551234" disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <ReclutadorFormField label="Dirección" htmlFor="direccion">
            <input id="direccion" type="text" name="direccion" value={form.direccion || ''} onChange={handleChange} placeholder="Ej: Calle 123 #45-67" disabled={submitting} className="reclutador-input-RP" />
          </ReclutadorFormField>

          <div className="form-row">
            <ReclutadorFormField label="Sitio Web" htmlFor="website">
              <input id="website" type="url" name="website" value={form.website || ''} onChange={handleChange} placeholder="Ej: https://www.empresa.com" disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="URL del Logo" htmlFor="logo">
              <input id="logo" type="url" name="logo" value={form.logo || ''} onChange={handleChange} placeholder="Ej: https://..." disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <div className="form-row">
            <ReclutadorFormField label="URL del Banner" htmlFor="banner">
              <input id="banner" type="url" name="banner" value={form.banner || ''} onChange={handleChange} placeholder="Ej: https://..." disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
            <ReclutadorFormField label="ID Municipio" htmlFor="municipioId">
              <input id="municipioId" type="number" name="municipioId" value={form.municipioId || ''} onChange={handleChange} placeholder="Ej: 76" disabled={submitting} className="reclutador-input-RP" />
            </ReclutadorFormField>
          </div>

          <ReclutadorFormField label="Descripción de la Empresa" htmlFor="descripcion" hint={`${(form.descripcion || '').length}/1000 caracteres`}>
            <textarea id="descripcion" name="descripcion" value={form.descripcion || ''} onChange={handleChange} placeholder="Describe tu empresa, misión, visión y valores..." rows="5" maxLength="1000" disabled={submitting} className="reclutador-textarea-RP" />
          </ReclutadorFormField>

          <div className="form-actions">
            <ReclutadorButton type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Guardar Cambios"}</ReclutadorButton>
            <ReclutadorButton type="button" onClick={handleCancel} disabled={submitting}>Cancelar</ReclutadorButton>
            <ReclutadorButton type="button" onClick={handleDelete} disabled={submitting}>Eliminar Empresa</ReclutadorButton>
          </div>
        </form>
      </ReclutadorCard>
    </ReclutadorLayout>
  );
}

export default EmpresaEditPage;
