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
import Header from "../../../../components/Header/Header";
import SidebarAspirante from "../../../../components/SidebarAspirante/SidebarAspirante";
import Footer from "../../../../components/Footer/footer";
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
    return <div className="actualizar-state-AP">Cargando formulario...</div>;
  }

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />

      <div className="actualizar-shell-AP">
        <SidebarAspirante />

        <main className="actualizar-main-AP">
          <section className="actualizar-hero-AP">
            <div>
              <p className="actualizar-kicker-AP">Editar perfil</p>
              <h1>Actualiza tus datos principales</h1>
              <p>Formulario corto con los campos que la API del aspirante permite modificar.</p>
            </div>
            <button type="button" className="secondary-button-AP" onClick={() => navigate("/Aspirante/MiPerfil")}>
              <X size={16} />
              Volver
            </button>
          </section>

          {success && <div className="alert-AP success">{success}</div>}
          {error && <div className="alert-AP error">{error}</div>}

          <form className="form-card-AP" onSubmit={handleSubmit}>
            <div className="form-grid-AP">
              <label className="field-AP">
                <span><User size={14} /> Nombre</span>
                <input name="nombre" value={formData.nombre} onChange={handleChange} required />
              </label>

              <label className="field-AP">
                <span><User size={14} /> Apellido</span>
                <input name="apellido" value={formData.apellido} onChange={handleChange} required />
              </label>

              <label className="field-AP">
                <span><Mail size={14} /> Correo</span>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} />
              </label>

              <label className="field-AP">
                <span><Phone size={14} /> Teléfono</span>
                <input name="telefono" value={formData.telefono} onChange={handleChange} />
              </label>

              <label className="field-AP">
                <span><Calendar size={14} /> Fecha de nacimiento</span>
                <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
              </label>

              <label className="field-AP">
                <span>Género</span>
                <select name="genero" value={formData.genero} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </label>

              <label className="field-AP field-wide-AP">
                <span><MapPin size={14} /> Municipio</span>
                <select name="municipioId" value={formData.municipioId} onChange={handleChange}>
                  <option value="">Seleccionar municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-AP field-wide-AP">
                <span>Foto de perfil URL</span>
                <div className="input-icon-AP">
                  <Image size={14} />
                  <input name="urlFotoPerfil" value={formData.urlFotoPerfil} onChange={handleChange} placeholder="https://..." />
                </div>
              </label>

              <label className="field-AP field-wide-AP">
                <span>Descripción</span>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} />
              </label>

              <label className="field-AP field-wide-AP">
                <span>Resumen profesional</span>
                <textarea name="resumen" value={formData.resumen} onChange={handleChange} rows={4} />
              </label>
            </div>

            <div className="actions-AP">
              <button type="button" className="secondary-button-AP" onClick={() => navigate("/Aspirante/MiPerfil")}>Cancelar</button>
              <button type="submit" className="primary-button-AP" disabled={saving}>
                <Save size={16} />
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default ActualizarPerfil;
