import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertCircle, Eye, EyeOff, Loader } from "lucide-react";
import Header from "../../../../components/Header/Header";
import Menu from "../../../../components/Menu/Menu";
import aspirantesApi from "../../../../api/aspirantesApi";
import "./EliminarPerfil.css";

const EliminarPerfil = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    setError("");

    // Validaciones
    if (!password || password.trim().length === 0) {
      setError("Debes ingresar tu contraseña para confirmar");
      return;
    }

    if (confirmText.toLowerCase() !== "eliminar") {
      setError('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    if (!window.confirm("⚠️ ÚLTIMA ADVERTENCIA: Esta acción es irreversible. ¿Estás completamente seguro de que deseas eliminar tu cuenta?")) {
      return;
    }

    setLoading(true);

    try {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) {
        throw new Error("No se encontró ID de usuario en sesión");
      }

      // Llamar a API para eliminar
      await aspirantesApi.deletePublic(usuarioId);

      // Limpiar localStorage
      localStorage.clear();

      alert("Tu cuenta ha sido eliminada exitosamente");
      navigate("/login");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      
      if (err.response?.status === 401) {
        setError("Contraseña incorrecta");
      } else if (err.response?.status === 403) {
        setError("No tienes permisos para realizar esta acción");
      } else {
        setError(err.message || "No se pudo eliminar la cuenta. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("¿Deseas cancelar la eliminación de tu cuenta?")) {
      navigate("/Aspirante/MiPerfil");
    }
  };

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />
      <Menu />

      <div className="eliminar-perfil-container">
        <div className="eliminar-perfil-card">
          {/* Header de advertencia */}
          <div className="eliminar-perfil-header">
            <Trash2 size={48} className="eliminar-icon" />
            <h1 className="eliminar-title">Eliminar Cuenta</h1>
            <p className="eliminar-subtitle">Esta acción es permanente e irreversible</p>
          </div>

          {/* Advertencia principal */}
          <div className="eliminar-warning">
            <AlertCircle size={24} />
            <div>
              <h3>⚠️ Advertencia</h3>
              <p>Al eliminar tu cuenta:</p>
              <ul>
                <li>Perderás acceso a todas tus postulaciones</li>
                <li>Tu hoja de vida será eliminada permanentemente</li>
                <li>No podrás recuperar tu información</li>
                <li>Todas las empresas perderán acceso a tu perfil</li>
              </ul>
            </div>
          </div>

          {/* Formulario de confirmación */}
          <div className="eliminar-form">
            {error && (
              <div className="eliminar-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Confirma tu contraseña</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Escribe "ELIMINAR" para confirmar</label>
              <input
                id="confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Escribe ELIMINAR"
                disabled={loading}
              />
            </div>

            <div className="eliminar-actions">
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn-delete"
                onClick={handleDeleteAccount}
                disabled={loading || !password || confirmText.toLowerCase() !== "eliminar"}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={20} />
                    Eliminar Cuenta Permanentemente
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EliminarPerfil;
