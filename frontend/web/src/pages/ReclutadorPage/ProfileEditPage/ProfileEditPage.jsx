import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import reclutadoresApi from "../../../api/reclutadoresApi";
import { getMunicipios } from "../../../api/municipioAPI";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../../components/Footer/footer";
import "./ProfileEditPage.css";

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

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <main className="main-profile-edit-PEP">
          <div className="loading-state">
            <p>Cargando datos del perfil...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />

      <main className="main-profile-edit-PEP">
        {/* HEADER CON NAVEGACIÓN */}
        <div className="header-page-PEP">
          <h1 className="title-page-PEP">Editar perfil de Reclutador</h1>
          <Link to="/Reclutador/ReclutadorProfile" className="link-return-PEP">
            ← Volver al perfil
          </Link>
        </div>

        {/* MENSAJE DE ERROR GLOBAL */}
        {error && (
          <div className="alert-error-PEP">
            <span className="alert-close-PEP" onClick={() => setError("")}>
              ×
            </span>
            {error}
          </div>
        )}

        {/* NAVEGACIÓN DE SECCIONES */}
        <nav className="nav-sections-PEP">
          <button
            className="nav-item-PEP active"
            onClick={() =>
              document
                .getElementById("profile-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="nav-icon-PEP"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Datos Personales
          </button>
          <button
            className="nav-item-PEP"
            onClick={() =>
              document
                .getElementById("email-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="nav-icon-PEP"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </button>
          <button
            className="nav-item-PEP"
            onClick={() =>
              document
                .getElementById("password-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="nav-icon-PEP"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Contraseña
          </button>
        </nav>

        {/* CONTENEDOR DE FORMULARIOS */}
        <div className="container-forms-edit-PEP">
          {/* FORMULARIO DE DATOS PERSONALES */}
          <section className="form-section-edit-PEP" id="profile-section">
            <div className="section-header-PEP">
              <div className="icon-container-PEP profile-icon-PEP">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon-svg-PEP"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="section-title-PEP">Datos Personales</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="form-content-PEP">
              {/* Nombre y Teléfono */}
              <div className="form-row-PEP">
                <div className="input-group-edit-PEP">
                  <label htmlFor="nombre" className="input-label-edit-PEP">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleProfileChange}
                    placeholder="Ej: Juan García"
                    className="input-field-PEP"
                    required
                    disabled={savingProfile}
                  />
                </div>

                <div className="input-group-edit-PEP">
                  <label htmlFor="telefono" className="input-label-edit-PEP">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleProfileChange}
                    placeholder="Ej: 3001234567"
                    className="input-field-PEP"
                    disabled={savingProfile}
                  />
                </div>
              </div>

              {/* Municipio */}
              <div className="form-row-PEP full-width-PEP">
                <div className="input-group-edit-PEP">
                  <label htmlFor="municipioId" className="input-label-edit-PEP">
                    Ubicación (Municipio)
                  </label>
                  <select
                    id="municipioId"
                    name="municipioId"
                    value={formData.municipioId || ""}
                    onChange={handleProfileChange}
                    className="input-field-PEP"
                    disabled={savingProfile}
                  >
                    <option value="">Selecciona un municipio</option>
                    {municipios.map((mun) => (
                      <option key={mun.id} value={mun.id}>
                        {mun.nombre} - {mun.departamento}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* URLs de Foto y Banner */}
              <div className="form-row-PEP">
                <div className="input-group-edit-PEP">
                  <label htmlFor="urlFotoPerfil" className="input-label-edit-PEP">
                    URL Foto de Perfil
                  </label>
                  <input
                    type="url"
                    id="urlFotoPerfil"
                    name="urlFotoPerfil"
                    value={formData.urlFotoPerfil}
                    onChange={handleProfileChange}
                    placeholder="Ej: https://ejemplo.com/foto.jpg"
                    className="input-field-PEP"
                    disabled={savingProfile}
                  />
                </div>

                <div className="input-group-edit-PEP">
                  <label htmlFor="urlBanner" className="input-label-edit-PEP">
                    URL Banner
                  </label>
                  <input
                    type="url"
                    id="urlBanner"
                    name="urlBanner"
                    value={formData.urlBanner}
                    onChange={handleProfileChange}
                    placeholder="Ej: https://ejemplo.com/banner.jpg"
                    className="input-field-PEP"
                    disabled={savingProfile}
                  />
                </div>
              </div>

              {/* Preview de Imágenes */}
              <div className="form-row-PEP full-width-PEP">
                <div className="preview-container-PEP">
                  <div className="preview-item-PEP">
                    <label>Vista Previa Foto de Perfil</label>
                    <div className="preview-image-PEP">
                      {formData.urlFotoPerfil ? (
                        <img
                          src={formData.urlFotoPerfil}
                          alt="Preview foto"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <span>No hay imagen</span>
                      )}
                    </div>
                  </div>

                  <div className="preview-item-PEP">
                    <label>Vista Previa Banner</label>
                    <div className="preview-image-banner-PEP">
                      {formData.urlBanner ? (
                        <img
                          src={formData.urlBanner}
                          alt="Preview banner"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <span>No hay imagen</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="button-action-edit-PEP button-primary-PEP"
                disabled={savingProfile}
              >
                {savingProfile ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </section>

          {/* FORMULARIO DE EMAIL */}
          <section className="form-section-edit-PEP" id="email-section">
            <div className="section-header-PEP">
              <div className="icon-container-PEP email-icon-PEP">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon-svg-PEP"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="section-title-PEP">Cambiar Email</h2>
            </div>

            <form onSubmit={handleEmailSubmit} className="form-content-PEP">
              <div className="current-info-display-PEP">
                <label className="label-current-PEP">Email actual</label>
                <p className="value-current-PEP">{usuario.correo}</p>
              </div>

              <div className="input-group-edit-PEP">
                <label htmlFor="newEmail" className="input-label-edit-PEP">
                  Nuevo email *
                </label>
                <input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="input-field-PEP"
                  required
                  disabled={loadingEmail}
                />
              </div>

              <div className="input-group-edit-PEP">
                <label
                  htmlFor="repeatNewEmail"
                  className="input-label-edit-PEP"
                >
                  Confirmar nuevo email *
                </label>
                <input
                  type="email"
                  id="repeatNewEmail"
                  name="repeatNewEmail"
                  value={repeatEmail}
                  onChange={(e) => setRepeatEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="input-field-PEP"
                  required
                  disabled={loadingEmail}
                />
              </div>

              <button
                type="submit"
                className="button-action-edit-PEP button-primary-PEP"
                disabled={loadingEmail}
              >
                {loadingEmail ? "Actualizando..." : "Actualizar Email"}
              </button>
            </form>
          </section>

          {/* FORMULARIO DE CONTRASEÑA */}
          <section className="form-section-edit-PEP" id="password-section">
            <div className="section-header-PEP">
              <div className="icon-container-PEP password-icon-PEP">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon-svg-PEP"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h2 className="section-title-PEP">Cambiar Contraseña</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="form-content-PEP">
              <div className="input-group-edit-PEP">
                <label
                  htmlFor="currentPassword"
                  className="input-label-edit-PEP"
                >
                  Contraseña actual *
                </label>
                <div className="input-password-wrapper-PEP">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field-PEP"
                    required
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    className="toggle-password-PEP"
                    onClick={() => togglePasswordVisibility("current")}
                    aria-label="Mostrar/Ocultar contraseña"
                    disabled={loadingPassword}
                  >
                    {showPasswords.current ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="input-group-edit-PEP">
                <label htmlFor="newPassword" className="input-label-edit-PEP">
                  Nueva contraseña *
                </label>
                <div className="input-password-wrapper-PEP">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field-PEP"
                    required
                    minLength={8}
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    className="toggle-password-PEP"
                    onClick={() => togglePasswordVisibility("new")}
                    aria-label="Mostrar/Ocultar contraseña"
                    disabled={loadingPassword}
                  >
                    {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                <p className="input-hint-PEP">Mínimo 8 caracteres</p>
              </div>

              <div className="input-group-edit-PEP">
                <label
                  htmlFor="repeatNewPassword"
                  className="input-label-edit-PEP"
                >
                  Confirmar nueva contraseña *
                </label>
                <div className="input-password-wrapper-PEP">
                  <input
                    type={showPasswords.repeat ? "text" : "password"}
                    id="repeatNewPassword"
                    name="repeatNewPassword"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field-PEP"
                    required
                    minLength={8}
                    disabled={loadingPassword}
                  />
                  <button
                    type="button"
                    className="toggle-password-PEP"
                    onClick={() => togglePasswordVisibility("repeat")}
                    aria-label="Mostrar/Ocultar contraseña"
                    disabled={loadingPassword}
                  >
                    {showPasswords.repeat ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="button-action-edit-PEP button-primary-PEP"
                disabled={loadingPassword}
              >
                {loadingPassword ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProfileEditPage;
