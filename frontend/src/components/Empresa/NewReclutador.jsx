import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./NewReclutador.css";

const NewReclutador = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

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

    try {
      console.log("Datos a enviar:", reclutadorNuevo);
      alert("Solicitud de registro enviada correctamente.");
      formRef.current.reset();
      navigate("/login");
    } catch (error) {
      alert("Hubo un error al registrar: " + error.message);
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

              <select name="municipioId" required className="form-input">
                <option value="">Selecciona municipio *</option>
                <option value="1">Bogotá D.C.</option>
                <option value="2">Medellín</option>
                <option value="3">Cali</option>
                <option value="4">Barranquilla</option>
                <option value="5">Cartagena</option>
              </select>

              {/* Inputs nuevos */}
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

            <button type="submit" className="submit-button">
              Registrarme como reclutador
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
