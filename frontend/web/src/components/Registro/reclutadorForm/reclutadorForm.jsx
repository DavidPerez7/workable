import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerReclutador } from "../../../api/authApi";
import { getMunicipios } from "../../../api/municipioAPI";
import "./ReclutadorForm.css";

const ReclutadorForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [compromisoInclusivo, setCompromisoInclusivo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [municipios, setMunicipios] = useState([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(true);

  useEffect(() => {
    const cargarMunicipios = async () => {
      try {
        const municipiosData = await getMunicipios();
        setMunicipios(municipiosData);
      } catch (error) {
        console.error("Error cargando municipios:", error);
        alert("Error al cargar la lista de municipios. Por favor, recarga la página.");
      } finally {
        setLoadingMunicipios(false);
      }
    };

    cargarMunicipios();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!compromisoInclusivo) {
      alert("Debes comprometerte con la inclusión laboral para continuar");
      return;
    }

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

    setLoading(true);
    try {
      const response = await registerReclutador(reclutadorData);
      console.log("Reclutador registrado:", response);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión");
      formRef.current.reset();
      setCompromisoInclusivo(false);
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar reclutador:", error);
      const mensajeError = error.response?.data?.error || "Error al registrar el reclutador";
      alert(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reclutador-form-container">
      <div className="reclutador-form-card">
        <div className="reclutador-form-header">
        </div>

        <form className="reclutador-form" onSubmit={handleSubmit} ref={formRef}>
          {/* Sección: Información Personal */}
          <div className="form-section personal-section">
            <h2 className="section-title-reclutador"><span style={{fontWeight: 'normal'}}>registro</span> <span style={{color: '#3b82f6'}}>Reclutador</span></h2>

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
                <select name="municipioId" required className="form-input" disabled={loadingMunicipios}>
                  <option value="">
                    {loadingMunicipios ? "Cargando municipios..." : "Selecciona tu municipio"}
                  </option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
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

          {/* Compromiso Inclusivo */}
          <div className="form-field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={compromisoInclusivo}
                onChange={(e) => setCompromisoInclusivo(e.target.checked)}
                required
              />
              <span>Me comprometo con la inclusión laboral *</span>
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta Reclutador"}
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
