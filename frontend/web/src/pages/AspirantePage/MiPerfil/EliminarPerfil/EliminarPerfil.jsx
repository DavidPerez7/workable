import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import AspiranteCard from "../../../../components/aspirante/AspiranteCard";
import AspiranteFormField from "../../../../components/aspirante/AspiranteFormField";
import AspiranteButton from "../../../../components/aspirante/AspiranteButton";
import AspiranteLayout from "../../AspiranteLayout";
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
    <AspiranteLayout shellClassName="eliminar-shell-AP" mainClassName="eliminar-main-AP">
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

      <AspiranteCard className="eliminar-card-AP">
        <div className="eliminar-warning-AP">
          <AlertCircle size={22} />
          <div>
            <strong>Antes de continuar</strong>
            <p>Se borrará tu perfil y perderás el acceso a tus postulaciones y hoja de vida.</p>
          </div>
        </div>

        <form className="eliminar-form-AP" onSubmit={handleDeleteAccount}>
          <AspiranteFormField label="Contraseña">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contraseña"
            />
          </AspiranteFormField>

          <AspiranteFormField label="Escribe ELIMINAR para confirmar">
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="ELIMINAR"
            />
          </AspiranteFormField>

          {error && <p className="eliminar-error-AP asp-alert error">{error}</p>}

          <div className="eliminar-actions-AP">
            <AspiranteButton type="button" variant="secondary" onClick={() => navigate("/Aspirante/MiPerfil")}>
              Cancelar
            </AspiranteButton>
            <AspiranteButton type="submit" variant="danger" disabled={loading}>
              {loading ? <Loader2 size={16} className="spin-AP" /> : <Trash2 size={16} />}
              {loading ? "Eliminando..." : "Eliminar cuenta"}
            </AspiranteButton>
          </div>
        </form>
      </AspiranteCard>
    </AspiranteLayout>
  );
};

export default EliminarPerfil;
