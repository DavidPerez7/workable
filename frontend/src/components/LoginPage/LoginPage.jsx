import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, redirectByRole } from '../../utils/auth';
import Header from '../Header/Header';
import Footer from '../Footer/footer';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [cla, setCla] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const data = await login(correo, cla);
      console.log('Login exitoso:', data);
      redirectByRole(navigate, data.role);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Header />
      <main className='main-login'>
        <div className="div-login">
          <form className="div-lg-form" onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>
            <input
              type="email"
              className="input-lg-form"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-lg-form"
              placeholder="Contraseña"
              value={cla}
              onChange={(e) => setCla(e.target.value)}
              required
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" className="button-submit">Entrar</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
