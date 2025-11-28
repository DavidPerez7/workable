import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../../components/Footer/Footer";
import "./ConfigPage.css";

const ConfigPage = () => {
  const navigate = useNavigate();

  // ============================================
  // ESTADOS
  // ============================================
  const [usuario, setUsuario] = useState({
    email: "ejemplo@gmail.com",
    cvVisible: true,
  });
  const [cvVisible, setCvVisible] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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
        cvVisible: data.cvVisible || true
      });
      setCvVisible(data.cvVisible || true);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cargar los datos del usuario');
    }
  };
  */

  // ============================================
  // MODIFICAR PRIVACIDAD (COMENTADO)
  // ============================================
  /*
  const handleModificarPrivacidad = async () => {
    if (loading) return;

    setLoading(true);
    
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
          cvVisible: cvVisible
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la privacidad');
      }

      const data = await response.json();
      setUsuario(prev => ({ ...prev, cvVisible: data.cvVisible }));
      
      alert('Privacidad actualizada exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al actualizar la privacidad: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  */

  // VERSIÓN SIMULADA
  const handleModificarPrivacidad = () => {
    setUsuario((prev) => ({ ...prev, cvVisible: cvVisible }));
    alert(`Privacidad actualizada: CV ${cvVisible ? "VISIBLE" : "NO VISIBLE"}`);
  };

  // ============================================
  // ELIMINAR CUENTA (COMENTADO)
  // ============================================
  /*
  const handleEliminarCuenta = async () => {
    if (!deleteConfirm) {
      alert('Debes confirmar que deseas eliminar tu cuenta');
      return;
    }

    const confirmacion = window.confirm(
      '⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE.\n\n' +
      '¿Estás completamente seguro de que deseas eliminar tu cuenta?\n\n' +
      'Se eliminarán:\n' +
      '• Tu perfil completo\n' +
      '• Todas tus ofertas publicadas\n' +
      '• Tu historial de actividad\n' +
      '• Todos los datos asociados'
    );

    if (!confirmacion) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`http://localhost:8080/api/usuario/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la cuenta');
      }

      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      alert('Cuenta eliminada exitosamente. Serás redirigido al inicio.');
      
      // Redirigir al inicio
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar la cuenta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  */

  // VERSIÓN SIMULADA
  const handleEliminarCuenta = () => {
    if (!deleteConfirm) {
      alert("Debes confirmar que deseas eliminar tu cuenta");
      return;
    }

    const confirmacion = window.confirm(
      "⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE.\n\n" +
        "¿Estás completamente seguro de que deseas eliminar tu cuenta?"
    );

    if (confirmacion) {
      alert("Cuenta eliminada exitosamente (simulación)");
      navigate("/");
    }
  };

  // ============================================
  // CERRAR SESIÓN
  // ============================================
  const handleCerrarSesion = () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );

    if (confirmacion) {
      // Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");

      // Redirigir al inicio
      navigate("/");
    }
  };

  return (
    <>
      <HeaderReclutador />
      <main className="main-config-CFP">
        <div className="container-module-CFP">
          {/* HEADER CON TÍTULO Y BOTÓN VOLVER */}
          <div className="header-page-CFP">
            <h1 className="title-page-CFP">Configuración de cuenta</h1>
            <Link to="/Reclutador" className="link-goback-CFP">
              ← Volver
            </Link>
          </div>

          {/* MÓDULO: EMAIL Y CONTRASEÑA */}
          <section className="section-module-config-CFP">
            <div className="header-module-config-CFP">
              <div className="icon-container-CFP email-icon-CFP">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon-svg-CFP"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <h2 className="title-module-config-CFP">
                Modificar e-mail y contraseña
              </h2>
              <Link
                to="/Reclutador/EditarPerfil"
                className="link-edit-config-CFP"
              >
                Editar
              </Link>
            </div>
            <div className="box-content-config-CFP">
              <p className="text-content-config-CFP">
                Estás registrado con el e-mail{" "}
                <span className="text-highlight-CFP">{usuario.email}</span>. A
                esta dirección te enviaremos las notificaciones sobre nuevas
                aplicaciones y actualizaciones de tus ofertas.
              </p>
            </div>
          </section>

          {/* MÓDULO: PRIVACIDAD */}
          <section className="section-module-config-CFP">
            <div className="header-module-config-CFP">
              <div className="icon-container-CFP privacy-icon-CFP">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon-svg-CFP"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="title-module-config-CFP">
                Nivel de privacidad del perfil
              </h2>
            </div>
            <div className="box-content-config-CFP">
              <div className="privacy-options-CFP">
                <div className="option-radio-CFP">
                  <input
                    type="radio"
                    id="cvVisible"
                    name="privacidad"
                    checked={cvVisible === true}
                    onChange={() => setCvVisible(true)}
                  />
                  <label htmlFor="cvVisible" className="label-radio-CFP">
                    <span className="label-title-CFP">
                      Perfil visible para empresas
                    </span>
                    <span className="label-description-CFP">
                      Las empresas pueden ver tu perfil y contactarte
                      directamente con ofertas relevantes.
                    </span>
                  </label>
                </div>

                <div className="option-radio-CFP">
                  <input
                    type="radio"
                    id="cvNotVisible"
                    name="privacidad"
                    checked={cvVisible === false}
                    onChange={() => setCvVisible(false)}
                  />
                  <label htmlFor="cvNotVisible" className="label-radio-CFP">
                    <span className="label-title-CFP">Perfil privado</span>
                    <span className="label-description-CFP">
                      Solo las empresas a las que apliques podrán ver tu perfil
                      y datos de contacto.
                    </span>
                  </label>
                </div>

                <button
                  className="button-action-config-CFP button-primary-CFP"
                  onClick={handleModificarPrivacidad}
                  disabled={loading}
                >
                  <span>
                    {loading ? "Guardando..." : "Guardar configuración"}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* MÓDULO: CERRAR SESIÓN */}
          <section className="section-module-config-CFP">
            <div className="header-module-config-CFP">
              <div className="icon-container-CFP logout-icon-CFP">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon-svg-CFP"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h2 className="title-module-config-CFP">Cerrar sesión</h2>
            </div>
            <div className="box-content-config-CFP">
              <p className="text-content-config-CFP">
                Cierra tu sesión actual de forma segura. Podrás volver a iniciar
                sesión en cualquier momento.
              </p>
              <button
                className="button-action-config-CFP button-logout-CFP"
                onClick={handleCerrarSesion}
              >
                <span>Cerrar sesión</span>
              </button>
            </div>
          </section>

          {/* MÓDULO: ELIMINAR CUENTA */}
          <section className="section-module-config-CFP section-danger-CFP">
            <div className="header-module-config-CFP">
              <div className="icon-container-CFP danger-icon-CFP">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon-svg-CFP"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="title-module-config-CFP">Zona de peligro</h2>
            </div>
            <div className="box-content-config-CFP">
              <div className="delete-account-options-CFP">
                <div className="warning-box-CFP">
                  <p className="warning-text-CFP">
                    ⚠️ <strong>Advertencia:</strong> Esta acción es permanente e
                    irreversible.
                  </p>
                  <p className="warning-description-CFP">
                    Al eliminar tu cuenta se borrarán:
                  </p>
                  <ul className="warning-list-CFP">
                    <li>Tu perfil completo y datos personales</li>
                    <li>Todas las ofertas laborales publicadas</li>
                    <li>Historial de aplicaciones y actividad</li>
                    <li>Toda la información asociada a tu cuenta</li>
                  </ul>
                </div>

                <div className="option-checkbox-CFP">
                  <input
                    type="checkbox"
                    id="deleteAccount"
                    name="deleteAccount"
                    checked={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.checked)}
                  />
                  <label htmlFor="deleteAccount" className="label-checkbox-CFP">
                    Confirmo que entiendo que esta acción es irreversible y
                    deseo eliminar mi cuenta{" "}
                    <span className="text-highlight-CFP">{usuario.email}</span>{" "}
                    de forma permanente.
                  </label>
                </div>

                <button
                  className="button-action-config-CFP button-danger-CFP"
                  onClick={handleEliminarCuenta}
                  disabled={!deleteConfirm || loading}
                >
                  <span>
                    {loading
                      ? "Eliminando..."
                      : "Eliminar cuenta permanentemente"}
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ConfigPage;
