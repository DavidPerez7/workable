import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Trash2, X, Loader } from "lucide-react";
import HeaderAspirant from "../../../../components/HeaderAspirant/HeaderAspirant";
import Menu from "../../../../components/Menu/Menu";
import Footer from "../../../../components/Footer/Footer";
import { eliminarUsuario } from "../../../../api/usuarioAPI";
import "./EliminarPerfil.css";

const EliminarPerfil = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Verificar sesión
  React.useEffect(() => {
    if (!userId || !token) {
      navigate("/Login");
    }
  }, [userId, token, navigate]);

  // ============================================
  // PASO 1: Confirmación inicial
  // ============================================
  const handleNextStep = () => {
    if (confirmText !== "ELIMINAR") {
      setError("Debes escribir ELIMINAR para continuar");
      return;
    }
    setError("");
    setStep(2);
  };

  // ============================================
  // PASO 2: Eliminar cuenta
  // ============================================
  const handleDeleteAccount = async () => {
    if (!password || password.trim().length === 0) {
      setError("Debes ingresar tu contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await eliminarUsuario(userId);

      // Limpiar localStorage
      localStorage.clear();

      alert("Tu cuenta ha sido eliminada exitosamente. ¡Hasta pronto!");
      navigate("/");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      setError(err.message || "No se pudo eliminar la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CANCELAR
  // ============================================
  const handleCancel = () => {
    navigate("/Aspirante/MiPerfil");
  };

  return (
    <>
      <HeaderAspirant />
      <Menu />

      <main className="main-eliminar-EPF">
        <div className="container-eliminar-EPF">
          {/* Header con advertencia */}
          <div className="header-warning-EPF">
            <AlertTriangle size={64} className="warning-icon-EPF" />
            <h1 className="title-EPF">Eliminar Cuenta</h1>
            <p className="subtitle-EPF">
              Esta acción es <strong>permanente e irreversible</strong>
            </p>
          </div>

          {/* Paso 1: Confirmación */}
          {step === 1 && (
            <div className="step-container-EPF">
              <div className="warning-box-EPF">
                <h3>⚠️ ¿Estás seguro?</h3>
                <p>Al eliminar tu cuenta se borrarán permanentemente:</p>
                <ul className="delete-list-EPF">
                  <li>✗ Toda tu información personal</li>
                  <li>✗ Tu hoja de vida y experiencia laboral</li>
                  <li>✗ Todas tus postulaciones activas</li>
                  <li>✗ Tus valoraciones y comentarios</li>
                  <li>✗ Tu historial de actividad</li>
                </ul>
                <p className="note-EPF">
                  <strong>Nota:</strong> No podrás recuperar esta información después de eliminar tu cuenta.
                </p>
              </div>

              <div className="confirm-section-EPF">
                <label className="form-label-EPF">
                  Escribe <strong>ELIMINAR</strong> para continuar:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => {
                    setConfirmText(e.target.value.toUpperCase());
                    setError("");
                  }}
                  placeholder="ELIMINAR"
                  className="form-input-EPF"
                  autoComplete="off"
                />
                {error && <p className="error-message-EPF">{error}</p>}
              </div>

              <div className="actions-EPF">
                <button
                  onClick={handleCancel}
                  className="btn-cancel-EPF"
                >
                  <X size={20} />
                  Cancelar
                </button>
                <button
                  onClick={handleNextStep}
                  className="btn-next-EPF"
                  disabled={confirmText !== "ELIMINAR"}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Contraseña */}
          {step === 2 && (
            <div className="step-container-EPF">
              <div className="password-section-EPF">
                <h3>🔐 Verificación de Seguridad</h3>
                <p>Ingresa tu contraseña para confirmar la eliminación:</p>

                <div className="form-group-EPF">
                  <label className="form-label-EPF">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Tu contraseña actual"
                    className="form-input-EPF"
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>

                {error && <p className="error-message-EPF">{error}</p>}
              </div>

              <div className="actions-EPF">
                <button
                  onClick={() => setStep(1)}
                  className="btn-back-EPF"
                  disabled={loading}
                >
                  Volver
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn-delete-EPF"
                  disabled={loading || !password}
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="spinner-EPF" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 size={20} />
                      Eliminar mi cuenta
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EliminarPerfil;
