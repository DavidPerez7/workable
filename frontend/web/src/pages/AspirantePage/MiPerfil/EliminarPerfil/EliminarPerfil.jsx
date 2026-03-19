import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import Header from "../../../../components/Header/Header";
import SidebarAspirante from "../../../../components/SidebarAspirante/SidebarAspirante";
import Footer from "../../../../components/Footer/footer";
import aspirantesApi from "../../../../api/aspirantesApi";
import "./EliminarPerfil.css";

const EliminarPerfil = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async (event) => {
    event.preventDefault();

    if (!password.trim()) {
      setError("Debes ingresar tu contraseña para confirmar.");
      return;
    }

    if (confirmText.toUpperCase() !== "ELIMINAR") {
      setError('Escribe "ELIMINAR" para continuar.');
      return;
    }

    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      try {
        await aspirantesApi.delete(usuarioId);
      } catch (deleteError) {
        await aspirantesApi.deletePublic(usuarioId);
      }

      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      setError(err.message || "No se pudo eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isLoggedIn={true} userRole="ASPIRANTE" />

      <div className="eliminar-shell-AP">
        <SidebarAspirante />

        <main className="eliminar-main-AP">
          <section className="eliminar-hero-AP">
            <div>
              <p className="eliminar-kicker-AP">Eliminar cuenta</p>
              <h1>Acción irreversible</h1>
              <p>
                Esta pantalla solo confirma la eliminación del perfil del aspirante
                con el endpoint disponible.
              </p>
            </div>
          </section>

          <section className="eliminar-card-AP">
            <div className="eliminar-warning-AP">
              <AlertCircle size={22} />
              <div>
                <strong>Antes de continuar</strong>
                <p>Se borrará tu perfil y perderás el acceso a tus postulaciones y hoja de vida.</p>
              </div>
            </div>

            <form className="eliminar-form-AP" onSubmit={handleDeleteAccount}>
              <label className="field-AP">
                <span>Contraseña</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresa tu contraseña"
                />
              </label>

              <label className="field-AP">
                <span>Escribe ELIMINAR para confirmar</span>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  placeholder="ELIMINAR"
                />
              </label>

              {error && <p className="eliminar-error-AP">{error}</p>}

              <div className="eliminar-actions-AP">
                <button type="button" className="secondary-button-AP" onClick={() => navigate("/Aspirante/MiPerfil")}>
                  Cancelar
                </button>
                <button type="submit" className="danger-button-AP" disabled={loading}>
                  {loading ? <Loader2 size={16} className="spin-AP" /> : <Trash2 size={16} />}
                  {loading ? "Eliminando..." : "Eliminar cuenta"}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default EliminarPerfil;
