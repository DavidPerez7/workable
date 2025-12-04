import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarEmpresa.css";

const RegistrarEmpresa = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

    const empresaData = {
      nombre: data.nombreEmpresa,
      nit: data.nit,
      razonSocial: data.razonSocial,
      descripcion: data.descripcionEmpresa,
      numeroTrabajadores: Number(data.numeroTrabajadores),
      emailContacto: data.emailContacto,
      telefonoContacto: data.telefonoContacto,
      ubicacion: data.ubicacion,
      website: data.website || null,
      categories: formData.getAll("categories"),
      municipio: {
        id: Number(data.municipioId),
      },
    };

    try {
      // 🔵 Aquí llamas tu API real
      // const response = await registrarEmpresaAPI(empresaData);

      console.log("Datos enviados:", empresaData);

      alert("Empresa registrada con éxito");
      formRef.current.reset();

      navigate("/Reclutador/EnterprisePage");

    } catch (error) {
      console.error("Error al registrar empresa:", error);
      alert("Error al registrar empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="empresa-form-container">
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
                <option value="1">Bogotá</option>
                <option value="2">Medellín</option>
                <option value="3">Cali</option>
                <option value="4">Barranquilla</option>
                <option value="5">Cartagena</option>
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
  );
};

export default RegistrarEmpresa;
