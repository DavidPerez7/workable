import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { getMunicipios } from "../../../api/municipioAPI";
import ReclutadorLayout from "../ReclutadorLayout";
import ReclutadorCard from "../../../components/reclutador/ReclutadorCard";
import ReclutadorSectionHeader from "../../../components/reclutador/ReclutadorSectionHeader";
import ReclutadorFormField from "../../../components/reclutador/ReclutadorFormField";
import ReclutadorButton from "../../../components/reclutador/ReclutadorButton";
import ReclutadorAlert from "../../../components/reclutador/ReclutadorAlert";
import ReclutadorActionRow from "../../../components/reclutador/ReclutadorActionRow";

function ProfileEditPage() {
  // ============================================
  // ESTADOS
  // ============================================
  const [usuario, setUsuario] = useState({
    id: null,
    correo: "",
    nombre: "",
    telefono: "",
    urlFotoPerfil: "",
    urlBanner: "",
    municipio: null,
  });

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    urlFotoPerfil: "",
    urlBanner: "",
    municipioId: null,
  });

  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Estados para email
  const [newEmail, setNewEmail] = useState("");
  const [repeatEmail, setRepeatEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Estados para contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    repeat: false,
  });

  // ============================================
  // CARGAR DATOS INICIALES
  // ============================================
  useEffect(() => {
    fetchUsuarioData();
    fetchMunicipios();
  }, []);

  const fetchUsuarioData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reclutadoresApi.getMyProfile();
      setUsuario({
        id: data.id,
        correo: data.correo,
        nombre: data.nombre,
        telefono: data.telefono || "",
        urlFotoPerfil: data.urlFotoPerfil || "",
        urlBanner: data.urlBanner || "",
        municipio: data.municipio || null,
      });
      setFormData({
        nombre: data.nombre || "",
        telefono: data.telefono || "",
        urlFotoPerfil: data.urlFotoPerfil || "",
        urlBanner: data.urlBanner || "",
        municipioId: data.municipio?.id || null,
      });
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const fetchMunicipios = async () => {
    try {
      const data = await getMunicipios();
      setMunicipios(data);
    } catch (err) {
      console.error("Error cargando municipios:", err);
    }
  };

  // ============================================
  // ACTUALIZAR DATOS DE PERFIL
  // ============================================
  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nombre || formData.nombre.trim() === "") {
      setError("El nombre es requerido");
      return;
    }

    setSavingProfile(true);
    setError("");

    try {
      const updateData = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        urlFotoPerfil: formData.urlFotoPerfil,
        urlBanner: formData.urlBanner,
      };

      if (formData.municipioId) {
        updateData.municipioId = parseInt(formData.municipioId);
      }

      const updatedData = await reclutadoresApi.update(usuario.id, updateData, usuario.id);

      setUsuario((prev) => ({
        ...prev,
        nombre: updatedData.nombre,
        telefono: updatedData.telefono,
        urlFotoPerfil: updatedData.urlFotoPerfil,
        urlBanner: updatedData.urlBanner,
        municipio: updatedData.municipio || prev.municipio,
      }));

      alert("Perfil actualizado exitosamente");
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = err.response?.data?.message || "Error al actualizar el perfil";
      setError(errorMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // VALIDACIONES
  // ============================================
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarPassword = (password) => {
    // Mínimo 8 caracteres
    return password.length >= 8;
  };

  // ============================================
  // MODIFICAR EMAIL
  // ============================================
  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    // Validaciones
    if (!newEmail || !repeatEmail) {
      setError("Por favor completa todos los campos de email");
      return;
    }

    if (!validarEmail(newEmail)) {
      setError("El email no tiene un formato válido");
      return;
    }

    if (newEmail !== repeatEmail) {
      setError("Los emails no coinciden");
      return;
    }

    if (newEmail === usuario.correo) {
      setError("El nuevo email es igual al actual");
      return;
    }

    setLoadingEmail(true);
    setError("");

    try {
      const updatedData = await reclutadoresApi.update(usuario.id, {
        correo: newEmail,
      }, usuario.id);

      setUsuario((prev) => ({ ...prev, correo: updatedData.correo }));

      setNewEmail("");
      setRepeatEmail("");
      alert("Email actualizado exitosamente");
    } catch (err) {
      console.error("Error:", err);
      const errorMsg =
        err.response?.data?.message || "Error al actualizar el email";
      setError(errorMsg);
    } finally {
      setLoadingEmail(false);
    }
  };

  // ============================================
  // MODIFICAR CONTRASEÑA
  // ============================================
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    // Validaciones
    if (!currentPassword || !newPassword || !repeatPassword) {
      setError("Por favor completa todos los campos de contraseña");
      return;
    }

    if (!validarPassword(newPassword)) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setLoadingPassword(true);
    setError("");

    try {
      // Nota: Asume que el backend tiene un endpoint para cambiar contraseña
      // Si no existe, se puede agregar o adaptar este endpoint
      await reclutadoresApi.update(usuario.id, {
        clave: newPassword,
        claveActual: currentPassword,
      }, usuario.id);

      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      alert("Contraseña actualizada exitosamente");
    } catch (err) {
      console.error("Error:", err);
      const errorMsg =
        err.response?.data?.message || "Error al actualizar la contraseña";
      setError(errorMsg);
    } finally {
      setLoadingPassword(false);
    }
  };

  // ============================================
  // TOGGLE VISIBILIDAD DE CONTRASEÑAS
  // ============================================
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <ReclutadorLayout>
        <main className="reclutador-main-RP">
          <ReclutadorCard>
            <p>Cargando datos del perfil...</p>
          </ReclutadorCard>
        </main>
      </ReclutadorLayout>
    );
  }

  return (
    <ReclutadorLayout>
      <main className="reclutador-main-RP">
        <ReclutadorSectionHeader
          kicker="Perfil"
          title="Editar perfil de Reclutador"
          action={<Link to="/Reclutador/ReclutadorProfile" className="reclutador-link-RP">Volver al perfil</Link>}
        />

        {error ? <ReclutadorAlert variant="error">{error}</ReclutadorAlert> : null}

        <ReclutadorActionRow>
          <ReclutadorButton variant="action" type="button" onClick={() => scrollToSection("profile-section")}>Datos Personales</ReclutadorButton>
          <ReclutadorButton variant="action" type="button" onClick={() => scrollToSection("email-section")}>Email</ReclutadorButton>
          <ReclutadorButton variant="action" type="button" onClick={() => scrollToSection("password-section")}>Contraseña</ReclutadorButton>
        </ReclutadorActionRow>

        <div className="reclutador-grid-RP">
          <ReclutadorCard id="profile-section">
            <ReclutadorSectionHeader kicker="Datos" title="Datos Personales" />

            <form onSubmit={handleProfileSubmit} className="reclutador-form-RP">
              <div className="reclutador-form-grid-RP">
                <ReclutadorFormField label="Nombre Completo *" htmlFor="nombre">
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleProfileChange}
                    placeholder="Ej: Juan García"
                    className="reclutador-input-RP"
                    required
                    disabled={savingProfile}
                  />
                </ReclutadorFormField>

                <ReclutadorFormField label="Teléfono" htmlFor="telefono">
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleProfileChange}
                    placeholder="Ej: 3001234567"
                    className="reclutador-input-RP"
                    disabled={savingProfile}
                  />
                </ReclutadorFormField>
              </div>

              <ReclutadorFormField label="Ubicación (Municipio)" htmlFor="municipioId">
                <select
                  id="municipioId"
                  name="municipioId"
                  value={formData.municipioId || ""}
                  onChange={handleProfileChange}
                  className="reclutador-select-RP"
                  disabled={savingProfile}
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((mun) => (
                    <option key={mun.id} value={mun.id}>
                      {mun.nombre} - {mun.departamento}
                    </option>
                  ))}
                </select>
              </ReclutadorFormField>

              <div className="reclutador-form-grid-RP">
                <ReclutadorFormField label="URL Foto de Perfil" htmlFor="urlFotoPerfil">
                  <input
                    type="url"
                    id="urlFotoPerfil"
                    name="urlFotoPerfil"
                    value={formData.urlFotoPerfil}
                    onChange={handleProfileChange}
                    placeholder="Ej: https://ejemplo.com/foto.jpg"
                    className="reclutador-input-RP"
                    disabled={savingProfile}
                  />
                </ReclutadorFormField>

                <ReclutadorFormField label="URL Banner" htmlFor="urlBanner">
                  <input
                    type="url"
                    id="urlBanner"
                    name="urlBanner"
                    value={formData.urlBanner}
                    onChange={handleProfileChange}
                    placeholder="Ej: https://ejemplo.com/banner.jpg"
                    className="reclutador-input-RP"
                    disabled={savingProfile}
                  />
                </ReclutadorFormField>
              </div>

              <div className="reclutador-form-grid-RP">
                <div className="reclutador-card-RP">
                  <p className="reclutador-kicker-RP">Vista previa</p>
                  <h3>Foto de perfil</h3>
                  {formData.urlFotoPerfil ? <img src={formData.urlFotoPerfil} alt="Preview foto" style={{ maxWidth: "100%", borderRadius: "12px" }} onError={(e) => (e.target.style.display = "none")} /> : <p>No hay imagen</p>}
                </div>

                <div className="reclutador-card-RP">
                  <p className="reclutador-kicker-RP">Vista previa</p>
                  <h3>Banner</h3>
                  {formData.urlBanner ? <img src={formData.urlBanner} alt="Preview banner" style={{ maxWidth: "100%", borderRadius: "12px" }} onError={(e) => (e.target.style.display = "none")} /> : <p>No hay imagen</p>}
                </div>
              </div>

              <ReclutadorButton type="submit" disabled={savingProfile}>
                {savingProfile ? "Guardando..." : "Guardar Cambios"}
              </ReclutadorButton>
            </form>
          </ReclutadorCard>

          <ReclutadorCard id="email-section">
            <ReclutadorSectionHeader kicker="Cuenta" title="Cambiar Email" />

            <form onSubmit={handleEmailSubmit} className="reclutador-form-RP">
              <div className="reclutador-card-RP">
                <p className="reclutador-kicker-RP">Email actual</p>
                <h3>{usuario.correo}</h3>
              </div>

              <ReclutadorFormField label="Nuevo email *" htmlFor="newEmail">
                <input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="reclutador-input-RP"
                  required
                  disabled={loadingEmail}
                />
              </ReclutadorFormField>

              <ReclutadorFormField label="Confirmar nuevo email *" htmlFor="repeatNewEmail">
                <input
                  type="email"
                  id="repeatNewEmail"
                  name="repeatNewEmail"
                  value={repeatEmail}
                  onChange={(e) => setRepeatEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="reclutador-input-RP"
                  required
                  disabled={loadingEmail}
                />
              </ReclutadorFormField>

              <ReclutadorButton type="submit" disabled={loadingEmail}>
                {loadingEmail ? "Actualizando..." : "Actualizar Email"}
              </ReclutadorButton>
            </form>
          </ReclutadorCard>

          <ReclutadorCard id="password-section">
            <ReclutadorSectionHeader kicker="Seguridad" title="Cambiar Contraseña" />

            <form onSubmit={handlePasswordSubmit} className="reclutador-form-RP">
              <ReclutadorFormField label="Contraseña actual *" htmlFor="currentPassword">
                <div className="reclutador-password-field-RP">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="reclutador-input-RP"
                    required
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    className="reclutador-password-toggle-RP"
                    onClick={() => togglePasswordVisibility("current")}
                    aria-label="Mostrar/Ocultar contraseña"
                    disabled={loadingPassword}
                  >
                    {showPasswords.current ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </ReclutadorFormField>

              <ReclutadorFormField label="Nueva contraseña *" htmlFor="newPassword" hint="Mínimo 8 caracteres">
                <div className="reclutador-password-field-RP">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="reclutador-input-RP"
                    required
                    minLength={8}
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    className="reclutador-password-toggle-RP"
                    onClick={() => togglePasswordVisibility("new")}
                    aria-label="Mostrar/Ocultar contraseña"
                    disabled={loadingPassword}
                  >
                    {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </ReclutadorFormField>

              <ReclutadorFormField label="Confirmar nueva contraseña *" htmlFor="repeatNewPassword">
                <div className="reclutador-password-field-RP">
                  <input
                    type={showPasswords.repeat ? "text" : "password"}
                    id="repeatNewPassword"
                    name="repeatNewPassword"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder="••••••••"
                    className="reclutador-input-RP"
                    required
                    minLength={8}
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    className="reclutador-password-toggle-RP"
                    onClick={() => togglePasswordVisibility("repeat")}
                    aria-label="Mostrar/Ocultar contraseña"
                    disabled={loadingPassword}
                  >
                    {showPasswords.repeat ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </ReclutadorFormField>

              <ReclutadorButton type="submit" disabled={loadingPassword}>
                {loadingPassword ? "Actualizando..." : "Actualizar contraseña"}
              </ReclutadorButton>
            </form>
          </ReclutadorCard>
        </div>
      </main>
    </ReclutadorLayout>
  );
}

export default ProfileEditPage;
