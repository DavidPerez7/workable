import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Image,
  MapPin,
  Mail,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import AspiranteCard from "../../../../components/aspirante/AspiranteCard";
import AspiranteFormField from "../../../../components/aspirante/AspiranteFormField";
import AspiranteButton from "../../../../components/aspirante/AspiranteButton";
import AspiranteAlert from "../../../../components/aspirante/AspiranteAlert";
import AspiranteLayout from "../../AspiranteLayout";
import aspirantesApi from "../../../../api/aspirantesApi";
import { getMunicipios } from "../../../../api/municipioAPI";
import "./ActualizarPerfil.css";

const formatearFecha = (fecha) => {
  if (!fecha) {
    return "";
  }

  return new Date(fecha).toISOString().slice(0, 10);
};

const ActualizarPerfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "",
    municipioId: "",
    descripcion: "",
    resumen: "",
    urlFotoPerfil: "",
  });

  const cargarDatos = async () => {
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [perfil, municipiosData] = await Promise.all([
        aspirantesApi.get(usuarioId),
        getMunicipios(),
      ]);

      setMunicipios(Array.isArray(municipiosData) ? municipiosData : []);
      setFormData({
        nombre: perfil?.nombre || "",
        apellido: perfil?.apellido || "",
        correo: perfil?.correo || "",
        telefono: perfil?.telefono || "",
        fechaNacimiento: formatearFecha(perfil?.fechaNacimiento),
        genero: perfil?.genero || "",
        municipioId: perfil?.municipio?.id ? String(perfil.municipio.id) : "",
        descripcion: perfil?.descripcion || "",
        resumen: perfil?.resumen || "",
        urlFotoPerfil: perfil?.urlFotoPerfil || "",
      });
    } catch (err) {
      console.error("Error al cargar datos del perfil:", err);
      setError(err.message || "No se pudo cargar el formulario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim(),
        fechaNacimiento: formData.fechaNacimiento || null,
        genero: formData.genero || null,
        descripcion: formData.descripcion.trim(),
        resumen: formData.resumen.trim(),
        urlFotoPerfil: formData.urlFotoPerfil.trim(),
        municipioId: formData.municipioId ? Number(formData.municipioId) : null,
        municipio: formData.municipioId ? { id: Number(formData.municipioId) } : null,
      };

      await aspirantesApi.update(usuarioId, payload);
      setSuccess("Perfil actualizado correctamente.");
      setTimeout(() => navigate("/Aspirante/MiPerfil"), 900);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError(err.message || "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AspiranteLayout shellClassName="actualizar-shell-AP" mainClassName="actualizar-main-AP">
        <div className="actualizar-state-AP asp-loading">Cargando formulario...</div>
      </AspiranteLayout>
    );
  }

  return (
    <AspiranteLayout shellClassName="actualizar-shell-AP" mainClassName="actualizar-main-AP">
      <section className="actualizar-hero-AP">
        <div>
          <p className="actualizar-kicker-AP">Editar perfil</p>
          <h1>Actualiza tus datos principales</h1>
          <p>Formulario corto con los campos que la API del aspirante permite modificar.</p>
        </div>
        <AspiranteButton type="button" variant="secondary" onClick={() => navigate("/Aspirante/MiPerfil") }>
          <X size={16} />
          Volver
        </AspiranteButton>
      </section>

      {success && <AspiranteAlert type="success">{success}</AspiranteAlert>}
      {error && <AspiranteAlert type="error">{error}</AspiranteAlert>}

      <AspiranteCard as="form" className="form-card-AP" onSubmit={handleSubmit}>
        <div className="form-grid-AP">
          <AspiranteFormField label={<><User size={14} /> Nombre</>}>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required />
          </AspiranteFormField>

          <AspiranteFormField label={<><User size={14} /> Apellido</>}>
            <input name="apellido" value={formData.apellido} onChange={handleChange} required />
          </AspiranteFormField>

          <AspiranteFormField label={<><Mail size={14} /> Correo</>}>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} />
          </AspiranteFormField>

          <AspiranteFormField label={<><Phone size={14} /> Teléfono</>}>
            <input name="telefono" value={formData.telefono} onChange={handleChange} />
          </AspiranteFormField>

          <AspiranteFormField label={<><Calendar size={14} /> Fecha de nacimiento</>}>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
          </AspiranteFormField>

          <AspiranteFormField label="Género">
            <select name="genero" value={formData.genero} onChange={handleChange}>
              <option value="">Seleccionar</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="OTRO">Otro</option>
            </select>
          </AspiranteFormField>

          <AspiranteFormField label={<><MapPin size={14} /> Municipio</>} fullWidth>
            <select name="municipioId" value={formData.municipioId} onChange={handleChange}>
              <option value="">Seleccionar municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
          </AspiranteFormField>

          <AspiranteFormField label="Foto de perfil URL" fullWidth>
            <div className="input-icon-AP">
              <Image size={14} />
              <input name="urlFotoPerfil" value={formData.urlFotoPerfil} onChange={handleChange} placeholder="https://..." />
            </div>
          </AspiranteFormField>

          <AspiranteFormField label="Descripción" fullWidth>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} />
          </AspiranteFormField>

          <AspiranteFormField label="Resumen profesional" fullWidth>
            <textarea name="resumen" value={formData.resumen} onChange={handleChange} rows={4} />
          </AspiranteFormField>
        </div>

        <div className="actions-AP">
          <AspiranteButton type="button" variant="secondary" onClick={() => navigate("/Aspirante/MiPerfil")}>Cancelar</AspiranteButton>
          <AspiranteButton type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? "Guardando..." : "Guardar cambios"}
          </AspiranteButton>
        </div>
      </AspiranteCard>
    </AspiranteLayout>
  );
};

export default ActualizarPerfil;
