import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReclutadorForm.css";

const ReclutadorForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [compromisoInclusivo, setCompromisoInclusivo] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!compromisoInclusivo) {
      alert("Debes comprometerte con la inclusión laboral para continuar");
      return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Validación de campos obligatorios
    const camposRequeridos = [
      "nombre",
      "apellido",
      "correo",
      "telefono",
      "password",
      "confirmPassword",
      "fechaNacimiento",
      "municipioId",
      "nombreEmpresa",
      "nit",
      "razonSocial",
      "descripcionEmpresa",
      "numeroTrabajadores",
      "emailContacto",
      "telefonoContacto",
    ];

    const camposFaltantes = camposRequeridos.filter((campo) => !data[campo]);

    if (camposFaltantes.length > 0) {
      alert("Todos los campos marcados con * son obligatorios");
      return;
    }

    // Validación de contraseña
    if (data.password.length < 8) {
      alert("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Preparar datos del reclutador (Usuario)
    const reclutadorData = {
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      telefono: data.telefono,
      password: data.password,
      fechaNacimiento: data.fechaNacimiento,
      rol: "RECLUTADOR",
      municipio: {
        id: Number(data.municipioId),
      },
    };

    // Preparar datos de la empresa
    const empresaData = {
      nombre: data.nombreEmpresa,
      nit: data.nit,
      razonSocial: data.razonSocial,
      descripcion: data.descripcionEmpresa,
      numeroTrabajadores: Number(data.numeroTrabajadores),
      emailContacto: data.emailContacto,
      telefonoContacto: data.telefonoContacto,
      website: data.website || null,
      categories: Array.from(formData.getAll("categories")),
      municipio: {
        id: Number(data.municipioId),
      },
      reclutadorOwner: reclutadorData,
    };

    const registroCompleto = {
      reclutador: reclutadorData,
      empresa: empresaData,
    };

    try {
      // Aquí deberías llamar a tu API que maneje el registro completo
      // const respuesta = await registrarReclutadorConEmpresa(registroCompleto);

      console.log("Datos a enviar:", registroCompleto);
      alert("Reclutador y empresa registrados con éxito");
      formRef.current.reset();
      setCompromisoInclusivo(false);

      // Redirigir al login o dashboard del reclutador
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      let mensajeError = "Error al completar el registro";

      if (error.response) {
        mensajeError = error.response.data.message || mensajeError;
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor";
      }

      alert(mensajeError);
    }
  };

  return (
    <div className="reclutador-form-container">
      <div className="reclutador-form-card">
        <div className="reclutador-form-header">
          <h1 className="reclutador-form-title">Registro de Reclutador</h1>
          <p className="reclutador-form-subtitle">
            Únete a nuestra plataforma inclusiva y representa tu empresa
          </p>
        </div>

        <form onSubmit={handleSubmit} ref={formRef}>
          {/* Sección: Datos del Reclutador */}
          <div className="form-section-personal-section">
            <h2 className="section-title-reclutador">Información Personal</h2>

            <div className="form-grid">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre *"
                required
                className="form-input"
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido *"
                required
                className="form-input"
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico *"
                required
                className="form-input"
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono *"
                required
                pattern="[0-9]{10}"
                className="form-input"
              />
              <input
                type="date"
                name="fechaNacimiento"
                required
                className="form-input"
              />
              <select name="municipioId" required className="form-input">
                <option value="">Selecciona municipio *</option>
                <option value="1">Bogotá D.C.</option>
                <option value="2">Medellín</option>
                <option value="3">Cali</option>
                <option value="4">Barranquilla</option>
                <option value="5">Cartagena</option>
              </select>
              <input
                type="password"
                name="password"
                placeholder="Contraseña (mín. 8 caracteres) *"
                required
                minLength="8"
                className="form-input"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña *"
                required
                minLength="8"
                className="form-input"
              />
            </div>
          </div>

          {/* Sección: Datos de la Empresa */}
          <div className="form-section empresa-section">
            <h2 className="section-title">Información de la Empresa</h2>

            <div className="form-grid">
              <input
                type="text"
                name="nombreEmpresa"
                placeholder="Nombre de la empresa *"
                required
                className="form-input"
              />
              <input
                type="text"
                name="nit"
                placeholder="NIT *"
                required
                className="form-input"
              />
              <input
                type="text"
                name="razonSocial"
                placeholder="Razón social *"
                required
                className="form-input"
              />
              <input
                type="number"
                name="numeroTrabajadores"
                placeholder="Número de trabajadores *"
                required
                min="1"
                className="form-input"
              />
              <input
                type="email"
                name="emailContacto"
                placeholder="Email de contacto empresarial *"
                required
                className="form-input"
              />
              <input
                type="tel"
                name="telefonoContacto"
                placeholder="Teléfono de contacto *"
                required
                pattern="[0-9]{10}"
                className="form-input"
              />
              <input
                type="url"
                name="website"
                placeholder="Sitio web (opcional)"
                className="form-input"
              />

              <div className="full-width">
                <textarea
                  name="descripcionEmpresa"
                  placeholder="Descripción de la empresa *"
                  required
                  rows="4"
                  className="form-input form-textarea"
                />
              </div>

              <div className="full-width">
                <label className="categories-label">
                  Categorías de la empresa (selecciona una o más) *
                </label>
                <div className="categories-grid">
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
                    <label key={cat} className="category-item">
                      <input
                        type="checkbox"
                        name="categories"
                        value={cat}
                        className="category-checkbox"
                      />
                      <span className="category-label">
                        {cat.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        <button type="submit" className="submit-button">
          Registrar Reclutador y Empresa
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="login-anchor">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default ReclutadorForm;
