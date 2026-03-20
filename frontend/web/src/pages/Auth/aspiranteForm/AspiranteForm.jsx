import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAspirante } from "../../../api/authApi";
import { getMunicipios } from "../../../api/municipioAPI";
import "./AspiranteForm.css";

const AspiranteForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
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

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password.length < 8) {
      alert("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const aspiranteData = {
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      telefono: data.telefono,
      password: data.password,
      fechaNacimiento: data.fechaNacimiento,
      genero: data.genero,
      rol: "ASPIRANTE",
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
      navigate("/Login");
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
      <form className="aspirante-form" onSubmit={handleSubmit} ref={formRef}>
        <div className="form-section personal-section">
          <h2 className="section-title-aspirante"><span style={{ fontWeight: "normal" }}>registro</span> <span style={{ color: "#3b82f6" }}>Aspirante</span></h2>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Nombre *</label>
              <input type="text" name="nombre" placeholder="Tu nombre" required className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" />
            </div>

            <div className="form-field">
              <label className="form-label">Apellido *</label>
              <input type="text" name="apellido" placeholder="Tu apellido" required className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" />
            </div>

            <div className="form-field">
              <label className="form-label">Correo electrónico *</label>
              <input type="email" name="correo" placeholder="tu@email.com" required className="form-input" />
            </div>

            <div className="form-field">
              <label className="form-label">Teléfono *</label>
              <input type="tel" name="telefono" placeholder="3001234567" required pattern="[0-9]{10}" className="form-input" title="Ingresa un número de 10 dígitos" />
            </div>

            <div className="form-field">
              <label className="form-label">Fecha de Nacimiento *</label>
              <input type="date" name="fechaNacimiento" required className="form-input" />
            </div>

            <div className="form-field">
              <label className="form-label">Municipio *</label>
              <select name="municipioId" required className="form-input" disabled={loadingMunicipios}>
                <option value="">{loadingMunicipios ? "Cargando municipios..." : "Selecciona tu municipio"}</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Género *</label>
              <select name="genero" required className="form-input">
                <option value="">Selecciona tu género</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Contraseña *</label>
              <input type="password" name="password" placeholder="Mínimo 8 caracteres" required minLength="8" className="form-input" />
            </div>

            <div className="form-field">
              <label className="form-label">Confirmar Contraseña *</label>
              <input type="password" name="confirmPassword" placeholder="Repite tu contraseña" required minLength="8" className="form-input" />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Registrando..." : "Crear Cuenta Aspirante"}
        </button>
      </form>
    </div>
  );
};

export default AspiranteForm;