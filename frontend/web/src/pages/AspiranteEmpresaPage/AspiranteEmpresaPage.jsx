import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Users, ArrowLeft } from "lucide-react";
import aspirantesApi from "../../api/aspirantesApi";
import AspiranteLayout from "../AspirantePage/AspiranteLayout";
import AspiranteCard from "../../components/aspirante/AspiranteCard";
import AspiranteButton from "../../components/aspirante/AspiranteButton";
import AspiranteFormField from "../../components/aspirante/AspiranteFormField";
import "./AspiranteEmpresaPage.css";

const AspiranteEmpresaPage = () => {
  const navigate = useNavigate();
  const [aspirante, setAspirante] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    loadAspiranteProfile();
  }, []);

  const loadAspiranteProfile = async () => {
    try {
      const profile = await aspirantesApi.getMyProfile();
      setAspirante(profile);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUnirseEmpresa = async (event) => {
    event.preventDefault();
    if (!codigo.trim()) {
      alert("Ingresa el código de la empresa.");
      return;
    }

    setLoading(true);
    try {
      await aspirantesApi.unirseEmpresa(codigo.trim());
      alert("Te has unido a la empresa exitosamente.");
      // Recargar el perfil para mostrar la empresa
      await loadAspiranteProfile();
      setCodigo("");
    } catch (error) {
      console.error("Error al unirse a la empresa:", error);
      alert("Error al unirse a la empresa. Verifica el código.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <AspiranteLayout>
        <AspiranteCard>Cargando...</AspiranteCard>
      </AspiranteLayout>
    );
  }

  const tieneEmpresa = aspirante?.empresa;

  return (
    <AspiranteLayout>
      <div className="empresa-header-AEP">
        <AspiranteButton
          variant="secondary"
          onClick={() => navigate("/Aspirante")}
          className="back-button-AEP"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </AspiranteButton>
        <h1 className="empresa-title-AEP">Mi Empresa</h1>
      </div>

      {tieneEmpresa ? (
        // Mostrar información de la empresa si ya pertenece a una
        <AspiranteCard>
          <div className="empresa-info-AEP">
            <div className="empresa-icon-AEP">
              <Building size={48} />
            </div>
            <div className="empresa-details-AEP">
              <h2>{aspirante.empresa.nombre}</h2>
              <p className="empresa-nit-AEP">NIT: {aspirante.empresa.nit}</p>
              <p className="empresa-descripcion-AEP">{aspirante.empresa.descripcion}</p>
              <div className="empresa-stats-AEP">
                <div className="stat-AEP">
                  <Users size={20} />
                  <span>{aspirante.empresa.numeroEmpleados || 0} empleados</span>
                </div>
              </div>
            </div>
          </div>
        </AspiranteCard>
      ) : (
        // Mostrar formulario para unirse a empresa si no pertenece a ninguna
        <AspiranteCard>
          <div className="unirse-empresa-AEP">
            <div className="unirse-icon-AEP">
              <Building size={48} />
            </div>
            <h2>Únete a una Empresa</h2>
            <p className="unirse-description-AEP">
              Para acceder a ofertas laborales exclusivas, únete a una empresa usando el código proporcionado por tu empleador.
            </p>

            <form onSubmit={handleUnirseEmpresa} className="unirse-form-AEP">
              <AspiranteFormField
                label="Código de la empresa"
                name="codigo"
                type="text"
                placeholder="Ingresa el código de la empresa"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />

              <AspiranteButton
                type="submit"
                disabled={loading}
                className="unirse-button-AEP"
              >
                {loading ? "Uniéndose..." : "Unirse a Empresa"}
              </AspiranteButton>
            </form>

            <div className="unirse-info-AEP">
              <p>
                <strong>¿No tienes un código?</strong><br />
                Contacta al reclutador de tu empresa para obtener el código de invitación.
              </p>
            </div>
          </div>
        </AspiranteCard>
      )}
    </AspiranteLayout>
  );
};

export default AspiranteEmpresaPage;