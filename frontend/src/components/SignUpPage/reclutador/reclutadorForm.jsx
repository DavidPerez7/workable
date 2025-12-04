import React, { useRef} from "react";
import { useNavigate } from "react-router-dom";
import { registrarReclutador } from "../../../api/authApi";
import "./ReclutadorForm.css";

const ReclutadorForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // === VALIDACIÓN DE CAMPOS OBLIGATORIOS (solo del reclutador) ===
    const camposRequeridos = [
      "nombre",
      "apellido",
      "correo",
      "telefono",
      "password",
      "confirmPassword",
      "fechaNacimiento",
      "municipioId",
    ];

    const camposFaltantes = camposRequeridos.filter((campo) => !data[campo]);
    if (camposFaltantes.length > 0) {
      alert("Todos los campos marcados con * son obligatorios");
      return;
    }

    // === VALIDACIÓN DE CONTRASEÑA ===
    if (data.password.length < 8) {
      alert("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // === OBJETO RECLUTADOR FINAL PARA API ===
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

    try {
      // 🔗 PETICIÓN REAL A LA API USANDO AXIOS
      const response = await registrarReclutador(reclutadorData);

      // Si la petición es exitosa (201 Created)
      console.log("Reclutador registrado con éxito:", response);
      alert("¡Reclutador registrado con éxito! Redirigiendo a login...");

      formRef.current.reset();
      
      // Redirigir a login después de 1 segundo
      setTimeout(() => navigate("/login"), 1000);

    } catch (error) {
      console.error("Error al registrar reclutador:", error.message);

      let mensajeError = "Error al completar el registro";

      if (error.response) {
        mensajeError = error.response.data?.message || 
                       error.response.data?.error || 
                       mensajeError;
      } else if (error.message) {
        mensajeError = error.message;
      }

      alert(mensajeError);
    }
  };

  return (
    <div className="reclutador-form-container">
      <div className="reclutador-form-card">

        {/* HEADER */}
        <div className="reclutador-form-header">
          <h1 className="reclutador-form-title">Registro de Reclutador</h1>
          <p className="reclutador-form-subtitle">
            Únete a nuestra plataforma de empleo.
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} ref={formRef}>

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

              <select
                name="municipioId"
                required
                className="form-input"
              >
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

          <button type="submit" className="submit-button">
            Registrar Reclutador
          </button>

        </form>

        {/* LINK DE NUEVO RECLUTADOR (TOKEN + NIT) */}
        <p className="new-reclutador-link">
          ¿Deseas ser reclutador de una empresa?{" "}
          <a
            href="/SignUpPage/NewReclutador"
            className="new-reclutador-anchor"
          >
            Regístrate aquí
          </a>
        </p>

        {/* LINK LOGIN */}
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
