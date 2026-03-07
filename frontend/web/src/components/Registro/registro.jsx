import React, { useState } from "react";
import Header from "../Header/Header";
import "./registro.css";
import ReclutadorForm from "./reclutadorForm/reclutadorForm";
import AspiranteForm from "./aspiranteForm/aspirante";

const SignUpPage = () => {
  const [userType, setUserType] = useState("aspirante");

  return (
    <>
      <Header />

      <main className="main-signup">
        <h2 className="h2-signup-title">Regístrate en workable</h2>
        <p className="p-signup-instruction">Crea una cuenta para comenzar</p>

        {/* BOTONES DE SELECCIÓN */}
        <div className="signup-buttons">
          <button
            className={`btn-signup ${
              userType === "aspirante" ? "active" : ""
            }`}
            onClick={() => setUserType("aspirante")}
          >
            Soy Aspirante
          </button>

          <button
            className={`btn-signup ${
              userType === "reclutador" ? "active" : ""
            }`}
            onClick={() => setUserType("reclutador")}
          >
            Soy Reclutador
          </button>
        </div>

        <div className="div-signup-container">
          {/* FORMULARIO ELEGIDO */}
          {userType === "aspirante" ? <AspiranteForm /> : <ReclutadorForm />}
        </div>
      </main>
    </>
  );
};

export default SignUpPage;
