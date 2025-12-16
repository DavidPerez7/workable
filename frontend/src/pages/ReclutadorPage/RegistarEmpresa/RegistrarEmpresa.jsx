import React, { useRef, useState, useEffect } from "react";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import SidebarReclutador from "../../../components/SidebarReclutador/SidebarReclutador";
import { crearEmpresa } from "../../../api/empresaAPI";
import { getMunicipios } from "../../../api/municipioAPI";
import reclutadoresApi from "../../../api/reclutadoresApi";
import "./RegistrarEmpresa.css";

const RegistrarEmpresa = () => {
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    const cargarMunicipios = async () => {
      try {
        const data = await getMunicipios();
        setMunicipios(data);
      } catch (error) {
        console.error("Error al cargar municipios:", error);
      }
    };
    cargarMunicipios();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Campos obligatorios
    const camposRequeridos = [
      "nombreEmpresa",
      "nit",
      "razonSocial",
      "ubicacion",
      "numeroTrabajadores",
      "emailContacto",
      "telefonoContacto",
      "descripcionEmpresa",
      "municipioId",
    ];

    const faltantes = camposRequeridos.filter((c) => !data[c]);

    if (faltantes.length > 0) {
      alert("Todos los campos marcados con * son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const categories = formData.getAll("categories");
      const empresaData = {
        nombre: data.nombreEmpresa,
        nit: data.nit,
        razonSocial: data.razonSocial,
        descripcion: data.descripcionEmpresa,
        numeroTrabajadores: Number(data.numeroTrabajadores),
        emailContacto: data.emailContacto,
        telefonoContacto: data.telefonoContacto,
        direcciones: [data.ubicacion],
        website: data.website || null,
        categoryEnum: categories.length > 0 ? categories : ["TECNOLOGIA"],
        municipio: {
          id: Number(data.municipioId),
        },
        isActive: true
      };

      console.log("Datos a enviar:", empresaData);

      const response = await crearEmpresa(empresaData);
      console.log("Empresa creada:", response);

      // Asignar la empresa al reclutador logueado
      try {
        await reclutadoresApi.asignarEmpresa(response.id);
        console.log("Empresa asignada al reclutador");
      } catch (err) {
        console.warn("No se pudo asignar la empresa automáticamente:", err);
      }

      // Actualizar localStorage con los datos de la empresa
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.empresa = { id: response.id };
      user.empresaId = response.id;
      user.empresaNombre = response.nombre;
      localStorage.setItem('user', JSON.stringify(user));

      alert("Empresa registrada con éxito");
      formRef.current.reset();

      // Recargar la página para que los cambios se reflejen inmediatamente
      setTimeout(() => {
        window.location.href = "/Reclutador/EnterprisePage";
      }, 500);

    } catch (error) {
      console.error("Error al registrar empresa:", error);
      alert(`Error al registrar empresa: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderReclutador />
      <div style={{display: 'flex', minHeight: 'calc(100vh - 80px)'}}>
        <SidebarReclutador />
        <div className="empresa-form-container" style={{flex: 1}}>
          <div className="empresa-form-card">

        <h1 className="empresa-title">Registrar Empresa</h1>
        <p className="empresa-subtitle">
          Completa la siguiente información para registrar tu empresa.
        </p>

        <form onSubmit={handleSubmit} ref={formRef}>

          <div className="empresa-section">
            <h2 className="empresa-section-title">Información de la Empresa</h2>

            <div className="empresa-grid">

              <input
                type="text"
                name="nombreEmpresa"
                placeholder="Nombre de la empresa *"
                className="empresa-input"
                required
              />

              <input
                type="text"
                name="nit"
                placeholder="NIT *"
                className="empresa-input"
                required
              />

              <input
                type="text"
                name="razonSocial"
                placeholder="Razón social *"
                className="empresa-input"
                required
              />

              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación *"
                className="empresa-input"
                required
              />

              <input
                type="number"
                name="numeroTrabajadores"
                placeholder="Número de trabajadores *"
                className="empresa-input"
                min="1"
                required
              />

              <input
                type="email"
                name="emailContacto"
                placeholder="Email de contacto empresarial *"
                className="empresa-input"
                required
              />

              <input
                type="tel"
                name="telefonoContacto"
                placeholder="Teléfono de contacto *"
                className="empresa-input"
                pattern="[0-9]{10}"
                required
              />

              <input
                type="url"
                name="website"
                placeholder="Sitio web (opcional)"
                className="empresa-input"
              />

              <select name="municipioId" required className="empresa-input">
                <option value="">Selecciona municipio *</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.nombre} - {mun.departamento?.nombre || ''}
                  </option>
                ))}
              </select>

              <div className="full-width">
                <textarea
                  name="descripcionEmpresa"
                  placeholder="Descripción de la empresa *"
                  className="empresa-textarea"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="full-width">
                <label className="empresa-categories-label">
                  Categorías de la empresa *
                </label>

                <div className="empresa-categories-grid">
                  {[
                    "TECNOLOGIA",
                    "SOFTWARE",
                    "SALUD",
                    "EDUCACION",
                    "FINANZAS",
                    "CONSULTORIA",
                    "MANUFACTURERA",
                    "RETAIL",
                    "MARKETING",
                    "RECURSOS_HUMANOS",
                  ].map((cat) => (
                    <label key={cat} className="empresa-category-item">
                      <input
                        type="checkbox"
                        name="categories"
                        value={cat}
                        className="empresa-category-checkbox"
                      />
                      <span className="empresa-category-label">
                        {cat.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <button type="submit" className="empresa-submit-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Empresa"}
          </button>
        </form>

      </div>
    </div>
      </div>
    </>
  );
};

export default RegistrarEmpresa;
