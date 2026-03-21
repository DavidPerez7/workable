import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import "./SignUpPage.css";
import ReclutadorForm from "./reclutadorForm/ReclutadorForm";
import AspiranteForm from "./aspiranteForm/AspiranteForm";

const SignUpPage = () => {
  const [userType, setUserType] = useState("aspirante");

  return (
    <>
      <Header variant="simple" showAuthActions />

      <main className="main-signup">
        <div className="signup-intro">
          <h2 className="h2-signup-title">Regístrate en workable</h2>
          <p className="p-signup-instruction">Crea una cuenta para comenzar</p>
        </div>

        <div className="signup-buttons">
          <button type="button" className={`btn-signup ${userType === "aspirante" ? "active" : ""}`} onClick={() => setUserType("aspirante")}>
            Soy Aspirante
          </button>

          <button type="button" className={`btn-signup ${userType === "reclutador" ? "active" : ""}`} onClick={() => setUserType("reclutador")}>
            Soy Reclutador
          </button>
        </div>

        {userType === "aspirante" ? <AspiranteForm /> : <ReclutadorForm />}

        <p className="text-link">
          ¿Ya tienes cuenta? <a href="/Login" className="login-anchor">Inicia sesión aquí</a>
        </p>
      </main>

      <Footer />
    </>
  );
};

export default SignUpPage;