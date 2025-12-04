import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Camera,
  Loader
} from "lucide-react";
import HeaderAspirant from "../../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../../components/Menu/Menu";
import Footer from "../../../../components/Footer/Footer";
import { getUsuario, actualizarUsuario } from "../../../../api/usuarioAPI";
import { getMunicipios } from "../../../../api/municipioAPI";
import "./ActualizarPerfil.css";

const ActualizarPerfil = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNacimiento: "",
    municipioId: "",
    urlFotoPerfil: ""
  });

  const [originalData, setOriginalData] = useState({});
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // ============================================================
  // Obtener datos actuales del perfil
  // ============================================================
  const cargarDatosPerfil = async () => {
    try {
      const data = await getUsuario(userId);

      const formattedData = {
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        telefono: data.telefono || "",
        fechaNacimiento: data.fechaNacimiento || "",
        municipioId: data.municipio?.id || "",
        urlFotoPerfil: data.urlFotoPerfil || ""
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setError("No se pudo cargar tu perfil");
      setLoading(false);
    }
  };

  // ============================================================
  // Cargar lista de municipios
  // ============================================================
  const cargarMunicipios = async () => {
    try {
      const data = await getMunicipios();
      setMunicipios(data);
    } catch (err) {
      console.error("Error cargando municipios:", err);
    }
  };

  // Detectar cambios en el formulario
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [formData, originalData]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!userId || !token) {
      navigate("/Login");
      return;
    }
    cargarDatosPerfil();
    cargarMunicipios();
  }, []);

  // ============================================================
  // Manejar cambios en inputs
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSuccess("");
  };

  // ============================================================
  // Manejar cambio de imagen de perfil
  // ============================================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tamaño (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen debe ser menor a 2 MB");
      return;
    }

    // Validar formato
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setError("Solo se permiten imágenes JPG o PNG");
      return;
    }

    // Por ahora solo guardamos la URL como string
    // En producción, esto debería subirse a un servidor/cloud
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        urlFotoPerfil: reader.result
      }));
    };
    reader.readAsDataURL(file);
    setError("");
  };

  // ============================================================
  // Actualizar perfil del aspirante
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError("El nombre y apellido son obligatorios");
      setSaving(false);
      return;
    }

    if (formData.telefono && formData.telefono.length < 10) {
      setError("El teléfono debe tener al menos 10 dígitos");
      setSaving(false);
      return;
    }

    if (!formData.municipioId) {
      setError("Debes seleccionar un municipio");
      setSaving(false);
      return;
    }

    try {
      // Preparar datos para enviar
      const updateData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono || null,
        fechaNacimiento: formData.fechaNacimiento || null,
        municipio: { id: parseInt(formData.municipioId) },
        urlFotoPerfil: formData.urlFotoPerfil || null
      };

      await actualizarUsuario(userId, updateData);

      // Actualizar datos originales con los nuevos
      setOriginalData(formData);
      setSuccess("¡Perfil actualizado exitosamente!");
      
      // Scroll al inicio para ver el mensaje
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/Aspirante/MiPerfil");
      }, 2000);

    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError("No se pudo actualizar el perfil. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // Cancelar y volver sin guardar
  // ============================================================
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("¿Descartar los cambios realizados?")) {
        navigate("/Aspirante/MiPerfil");
      }
    } else {
      navigate("/Aspirante/MiPerfil");
    }
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="loading-container-APF">
        <Loader className="spinner-APF" size={48} />
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <>
      <HeaderAspirant />
      <Menu />

      <main className="main-actualizar-perfil-APF">
        <div className="container-actualizar-perfil-APF">
          
          {/* Header */}
          <div className="header-section-APF">
            <h1 className="title-APF">Actualizar Perfil</h1>
            <p className="subtitle-APF">
              Mantén tu información actualizada para mejorar tus oportunidades laborales
            </p>
          </div>

          {/* Mensajes de éxito/error */}
          {success && (
            <div className="alert-success-APF">
              <CheckCircle size={24} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert-error-APF">
              <AlertCircle size={24} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-actualizar-APF">
            
            {/* Foto de perfil */}
            <section className="section-foto-APF">
              <h2 className="section-title-APF">
                <Camera size={24} />
                Foto de Perfil
              </h2>
              
              <div className="foto-container-APF">
                <div className="foto-preview-APF">
                  {formData.urlFotoPerfil ? (
                    <img src={formData.urlFotoPerfil} alt="Vista previa" />
                  ) : (
                    <User size={64} className="foto-placeholder-icon-APF" />
                  )}
                </div>
                
                <div className="foto-actions-APF">
                  <label htmlFor="foto-input" className="btn-upload-APF">
                    <Camera size={20} />
                    Cambiar foto
                  </label>
                  <input
                    type="file"
                    id="foto-input"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="foto-input-hidden-APF"
                  />
                  <p className="foto-hint-APF">
                    Máximo 2 MB - Formatos: JPG, PNG
                  </p>
                </div>
              </div>
            </section>

            {/* Información Personal */}
            <section className="section-form-APF">
              <h2 className="section-title-APF">
                <User size={24} />
                Información Personal
              </h2>

              <div className="form-grid-APF">
                <div className="form-group-APF">
                  <label htmlFor="nombre" className="form-label-APF">
                    Nombre <span className="required-APF">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-input-APF"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="form-group-APF">
                  <label htmlFor="apellido" className="form-label-APF">
                    Apellido <span className="required-APF">*</span>
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="form-input-APF"
                    placeholder="Tu apellido"
                    required
                  />
                </div>

                <div className="form-group-APF">
                  <label htmlFor="fechaNacimiento" className="form-label-APF">
                    Fecha de Nacimiento
                  </label>
                  <div className="input-with-icon-APF">
                    <Calendar size={20} className="input-icon-APF" />
                    <input
                      type="date"
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className="form-input-APF"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Información de Contacto */}
            <section className="section-form-APF">
              <h2 className="section-title-APF">
                <Phone size={24} />
                Información de Contacto
              </h2>

              <div className="form-grid-APF">
                <div className="form-group-APF">
                  <label htmlFor="telefono" className="form-label-APF">
                    Teléfono
                  </label>
                  <div className="input-with-icon-APF">
                    <Phone size={20} className="input-icon-APF" />
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="form-input-APF"
                      placeholder="3001234567"
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <span className="form-hint-APF">10 dígitos sin espacios</span>
                </div>

                <div className="form-group-APF">
                  <label htmlFor="municipioId" className="form-label-APF">
                    Municipio <span className="required-APF">*</span>
                  </label>
                  <div className="input-with-icon-APF">
                    <MapPin size={20} className="input-icon-APF" />
                    <select
                      id="municipioId"
                      name="municipioId"
                      value={formData.municipioId}
                      onChange={handleChange}
                      className="form-select-APF"
                      required
                    >
                      <option value="">Selecciona un municipio</option>
                      {municipios.map(municipio => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Botones de acción */}
            <div className="form-actions-APF">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel-APF"
                disabled={saving}
              >
                <X size={20} />
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-save-APF"
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <>
                    <Loader size={20} className="spinner-APF" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ActualizarPerfil;
