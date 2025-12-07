import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../../components/Footer/footer";
import "./ProfileEditPage.css";

function ProfileEditPage() {
  const navigate = useNavigate();

  // ============================================
  // ESTADOS
  // ============================================
  const [usuario, setUsuario] = useState({
    email: "ejemplo@gmail.com",
    nombre: "Usuario",
  });

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
  // OBTENER DATOS DEL USUARIO (COMENTADO)
  // ============================================
  /*
  useEffect(() => {
    fetchUsuarioData();
  }, []);

  const fetchUsuarioData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`http://localhost:8080/api/usuario/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener datos del usuario');
      }

      const data = await response.json();
      setUsuario({
        email: data.correo,
        nombre: data.nombre
      });
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cargar los datos del usuario');
    }
  };
  */

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
  // MODIFICAR EMAIL (COMENTADO)
  // ============================================
  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    // Validaciones
    if (!newEmail || !repeatEmail) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!validarEmail(newEmail)) {
      alert("El email no tiene un formato válido");
      return;
    }

    if (newEmail !== repeatEmail) {
      alert("Los emails no coinciden");
      return;
    }

    if (newEmail === usuario.email) {
      alert("El nuevo email es igual al actual");
      return;
    }

    // VERSIÓN SIMULADA
    alert(`Email actualizado a: ${newEmail} (simulación)`);
    setNewEmail("");
    setRepeatEmail("");

    /*
    // VERSIÓN CON API (DESCOMENTAR AL USAR)
    setLoadingEmail(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`http://localhost:8080/api/usuario/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: newEmail
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el email');
      }

      const data = await response.json();
      
      // Actualizar estado local
      setUsuario(prev => ({ ...prev, email: data.correo }));
      
      alert('Email actualizado exitosamente');
      setNewEmail('');
      setRepeatEmail('');
      
      // Opcional: redirigir a configuración
      // navigate('/Reclutador/configuracion');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al actualizar el email: ' + err.message);
    } finally {
      setLoadingEmail(false);
    }
    */
  };

  // ============================================
  // MODIFICAR CONTRASEÑA (COMENTADO)
  // ============================================
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    // Validaciones
    if (!currentPassword || !newPassword || !repeatPassword) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!validarPassword(newPassword)) {
      alert("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (currentPassword === newPassword) {
      alert("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    // VERSIÓN SIMULADA
    alert("Contraseña actualizada exitosamente (simulación)");
    setCurrentPassword("");
    setNewPassword("");
    setRepeatPassword("");

    /*
    // VERSIÓN CON API (DESCOMENTAR AL USAR)
    setLoadingPassword(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('No hay sesión activa');
      }

      // Opción 1: Endpoint específico para cambiar contraseña
      const response = await fetch(`http://localhost:8080/api/usuario/${userId}/cambiar-clave`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claveActual: currentPassword,
          claveNueva: newPassword
        })
      });

      // Opción 2: Usar endpoint general de actualización
      // const response = await fetch(`http://localhost:8080/api/usuario/${userId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     clave: newPassword,
      //     claveActual: currentPassword
      //   })
      // });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la contraseña');
      }

      alert('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setRepeatPassword('');
      
      // Opcional: cerrar sesión y redirigir al login
      // localStorage.removeItem('token');
      // navigate('/login');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al actualizar la contraseña: ' + err.message);
    } finally {
      setLoadingPassword(false);
    }
    */
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

  return (
    <>
      <HeaderReclutador />

      <main className="main-profile-edit-PEP">
        {/* HEADER CON NAVEGACIÓN */}
        <div className="header-page-PEP">
          <h1 className="title-page-PEP">Editar perfil</h1>
          <Link to="/Reclutador/configuracion" className="link-return-PEP">
            ← Volver a configuración
          </Link>
        </div>

        {/* NAVEGACIÓN DE SECCIONES */}
        <nav className="nav-sections-PEP">
          <button
            className="nav-item-PEP active"
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
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            Modificar email
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
            Modificar contraseña
          </button>
        </nav>

        {/* CONTENEDOR DE FORMULARIOS */}
        <div className="container-forms-edit-PEP">
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
              <h2 className="section-title-PEP">Cambiar dirección de email</h2>
            </div>

            <form onSubmit={handleEmailSubmit} className="form-content-PEP">
              <div className="current-info-display-PEP">
                <label className="label-current-PEP">Email actual</label>
                <p className="value-current-PEP">{usuario.email}</p>
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
                />
              </div>

              <button
                type="submit"
                className="button-action-edit-PEP button-primary-PEP"
                disabled={loadingEmail}
              >
                {loadingEmail ? "Actualizando..." : "Actualizar email"}
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
              <h2 className="section-title-PEP">Cambiar contraseña</h2>
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
                  />
                  <button
                    type="button"
                    className="toggle-password-PEP"
                    onClick={() => togglePasswordVisibility("current")}
                    aria-label="Mostrar/Ocultar contraseña"
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
                  />
                  <button
                    type="button"
                    className="toggle-password-PEP"
                    onClick={() => togglePasswordVisibility("new")}
                    aria-label="Mostrar/Ocultar contraseña"
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
                  />
                  <button
                    type="button"
                    className="toggle-password-PEP"
                    onClick={() => togglePasswordVisibility("repeat")}
                    aria-label="Mostrar/Ocultar contraseña"
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
