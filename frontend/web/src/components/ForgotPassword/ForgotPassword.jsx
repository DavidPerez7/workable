import React from "react";
import { Link } from 'react-router-dom';
import Header from "../Header/Header";

import Footer from "../Footer/footer";

import './ForgotPassword.css';

const ForgotPassword = () => {
  return (
    <>
      <Header />
      <main className="main-forgot-password">
        <div className="div-forgot-password-container">
          <form className="form-forgot-password">
            <h2 className="h2-forgot-password-title">¿Olvidaste tu contraseña?</h2>
            <p className="p-forgot-password-instruction">
              Ingresa tu correo electrónico o número de teléfono registrado
              para recibir un código de recuperación.
            </p>
            <input
              type="text"
              className="input-forgot-password"
              placeholder="Correo electrónico o teléfono"
            />
            <button type="submit" className="button-send-code">
              Enviar Código
            </button>
            <Link to='/Login'>
              <p className="text-link-back">Volver al inicio de sesión</p>
            </Link>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;