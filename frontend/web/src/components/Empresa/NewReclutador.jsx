import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { crearEmpresa } from "../../api/empresaAPI";
import { getMunicipios } from "../../api/municipioAPI";
import "./NewReclutador.css";

const NewReclutador = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [municipios, setMunicipios] = useState([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(true);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const cargarMunicipios = async () => {
      try {
        const municipiosData = await getMunicipios();
        setMunicipios(municipiosData);
      } catch (error) {
        console.error("Error cargando municipios:", error);
        alert("Error al cargar municipios");
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

    const camposRequeridos = [
      "nombre",
      "apellido",
      "correo",
      "telefono",
      "password",
      "confirmPassword",
      "fechaNacimiento",
      "municipioId",
      "nitEmpresa",
      "nombreEmpresa",
      "codigoInvitacion",
    ];

    const faltantes = camposRequeridos.filter((c) => !data[c]);

    if (faltantes.length > 0) {
      alert("Todos los campos con * son obligatorios");
      return;
    }

    if (data.password.length < 8) {
      alert("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear la empresa primero
      const empresaData = {
        nombre: data.nombreEmpresa,
        nit: data.nitEmpresa,
        isActive: true,
      };

      const empresaCreada = await crearEmpresa(empresaData);
      console.log("Empresa creada:", empresaCreada);

      // 2. Después guardar el reclutador (esto lo hará el backend vinculado a la empresa)
      const reclutadorNuevo = {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono,
        password: data.password,
        fechaNacimiento: data.fechaNacimiento,
        municipio: {
          id: Number(data.municipioId),
        },
        nitEmpresa: data.nitEmpresa,
        codigoInvitacion: data.codigoInvitacion,
      };

      console.log("Datos a enviar:", reclutadorNuevo);
      alert("¡Empresa y reclutador registrados correctamente! Ahora puedes iniciar sesión.");
      formRef.current.reset();
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al registrar: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="new-reclutador-container">
        <div className="new-reclutador-card">
          <h1 className="new-reclutador-title">Registro de Nuevo Reclutador</h1>
          <p className="new-reclutador-subtitle">
            Ingresa el NIT de la empresa y el código que te proporcionó tu
            administrador.
          </p>

          <form
            onSubmit={handleSubmit}
            ref={formRef}
            className="new-reclutador-form"
          >
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
                placeholder="Correo *"
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

              <select name="municipioId" required className="form-input" disabled={loadingMunicipios}>
                <option value="">
                  {loadingMunicipios ? "Cargando municipios..." : "Selecciona municipio *"}
                </option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                  </option>
                ))}
              </select>

              {/* Inputs nuevos */}
              <input
                type="text"
                name="nombreEmpresa"
                placeholder="Nombre de la empresa *"
                required
                className="form-input"
              />
              <input
                type="text"
                name="nitEmpresa"
                placeholder="NIT de la empresa *"
                required
                className="form-input"
              />
              <input
                type="text"
                name="codigoInvitacion"
                placeholder="Código de invitación *"
                required
                className="form-input"
              />

              <input
                type="password"
                name="password"
                placeholder="Contraseña *"
                minLength="8"
                required
                className="form-input"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña *"
                minLength="8"
                required
                className="form-input"
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Registrando..." : "Registrarme como reclutador"}
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
    </>
  );
};

export default NewReclutador;
