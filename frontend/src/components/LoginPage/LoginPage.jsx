import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
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
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo,
          clave: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Credenciales inválidas");
      }

      const data = await res.json();
      console.log("Login response:", data);

      // Guardar el token JWT y refreshToken
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("userId", data.usuarioId);

      // Redirigir según el rol del usuario
      switch (data.rol) {
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
      console.error("Error de login:", error);
      setErrorMessage(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="main-login">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Iniciar Sesión</h2>
              <p className="login-subtitle">
                Accede a tu cuenta para ver oportunidades laborales
              </p>
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

              {errorMessage && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className={`submit-button ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>

              <div className="form-footer">
                <a href="/recuperar-password" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
