import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await login({ correo, password });

      switch (response.rol) {
        case "ASPIRANTE":
          navigate("/Aspirante");
          break;
        case "RECLUTADOR":
          navigate("/Reclutador");
          break;
        case "ADMIN":
          navigate("/Administrador");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header variant="simple" showAuthActions />
      <div className="login-page-shell">
        <main className="main-login">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <h2 className="login-title">Iniciar Sesión</h2>
              </div>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label" htmlFor="correo">
                    Correo electrónico
                  </label>
                  <input
                    id="correo"
                    type="email"
                    className="form-input"
                    placeholder="Correo electronico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {errorMessage ? (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errorMessage}
                  </div>
                ) : null}

                <button type="submit" className={`submit-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>

                <div className="form-footer">
                  <Link to="/Signup" className="forgot-password">
                    No tienes cuenta? Crea una cuenta
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;