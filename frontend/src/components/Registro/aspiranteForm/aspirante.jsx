import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAspirante } from "../../../api/authApi";
import "./aspirante.css";
import "../reclutadorForm/ReclutadorForm.css";

const AspiranteForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Validación de contraseña
    if (data.password.length < 8) {
      alert("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Preparar datos del aspirante basado en Usuario.java
    const aspiranteData = {
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      telefono: data.telefono,
      password: data.password,
      fechaNacimiento: data.fechaNacimiento,
      municipio: {
        id: Number(data.municipioId),
      },
    };

    setLoading(true);
    try {
      const response = await registerAspirante(aspiranteData);
      console.log("Aspirante registrado:", response);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión");
      formRef.current.reset();
      setAceptaTerminos(false);
      navigate("/login");
    } catch (error) {
      console.error("Error al crear aspirante:", error);
      const mensajeError = error.response?.data?.error || "Error al registrar el aspirante";
      alert(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aspirante-form-container">
      <div className="aspirante-form-card">
        <div className="aspirante-form-header">
        </div>

        <form className="aspirante-form" onSubmit={handleSubmit} ref={formRef}>
          {/* Sección: Información Personal */}
          <div className="form-section personal-section">
            <h2 className="section-title-reclutador"><span style={{fontWeight: 'normal'}}>registro</span> <span style={{color: '#3b82f6'}}>Aspirante</span></h2>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  required
                  className="form-input"
                  pattern="[A-Za-zÀ-ÿ\s]+"
                  title="Solo se permiten letras y espacios"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Tu apellido"
                  required
                  className="form-input"
                  pattern="[A-Za-zÀ-ÿ\s]+"
                  title="Solo se permiten letras y espacios"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Correo electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  placeholder="tu@email.com"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="3001234567"
                  required
                  pattern="[0-9]{10}"
                  className="form-input"
                  title="Ingresa un número de 10 dígitos"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Municipio *</label>
                <select name="municipioId" required className="form-input">
                  <option value="">Selecciona tu municipio</option>
                  <option value="1">Bogotá D.C.</option>
                  <option value="2">Medellín</option>
                  <option value="3">Bello</option>
                  <option value="4">Itagüí</option>
                  <option value="5">Envigado</option>
                  <option value="6">Rionegro</option>
                  <option value="7">Cali</option>
                  <option value="8">Barranquilla</option>
                  <option value="9">Bucaramanga</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength="8"
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Confirmar Contraseña *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  required
                  minLength="8"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="form-field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                required
              />
              <span>Acepto los términos y condiciones *</span>
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta Aspirante"}
          </button>
        </form>

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

export default AspiranteForm;
