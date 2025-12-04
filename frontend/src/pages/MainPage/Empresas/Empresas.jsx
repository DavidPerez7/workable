import React from "react";
import "./Empresas.css";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

function Empresas() {
  const navigate = useNavigate();

  // Simulación de navegación (podrás conectar URLs reales)
  const handleSelect = (nombre) => {
    console.log("Seleccionaste:", nombre);
    // navigate(`/empresas/${nombre.toLowerCase()}`);  <-- cuando tengas las rutas
  };

  return (
    <>
      <Header />

      <main className="main-empresas">
        <h1 className="empresas-title">Descubre las mejores empresas según su sector</h1>

        <div className="empresas-forms">
          
          {/* ======================= */}
          {/* EMPRESAS POR SECTOR */}
          {/* ======================= */}
          <section className="form-section">
            <h2 className="form-title">Empresas por sectores</h2>
            <ul className="empresa-list">
              {[
                "Tecnología",
                "Salud",
                "Educación",
                "Finanzas",
                "Logística",
                "Alimentos",
                "Entretenimiento",
                "Automotriz",
              ].map((item) => (
                <li key={item} onClick={() => handleSelect(item)}>
                  {item}
                  <span className="arrow-item">&rsaquo;</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ======================= */}
          {/* EMPRESAS MÁS SEGUIDAS */}
          {/* ======================= */}
          <section className="form-section">
            <h2 className="form-title">Empresas con más seguidores</h2>
            <ul className="empresa-list">
              {[
                "Google",
                "Microsoft",
                "Amazon",
                "Meta",
                "Netflix",
                "Tesla",
                "Apple",
                "IBM",
              ].map((item) => (
                <li key={item} onClick={() => handleSelect(item)}>
                  {item}
                  <span className="arrow-item">&rsaquo;</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ======================= */}
          {/* EMPRESAS RECIÉN EVALUADAS */}
          {/* ======================= */}
          <section className="form-section">
            <h2 className="form-title">Empresas recién evaluadas</h2>
            <ul className="empresa-list">
              {[
                "Nubank",
                "Rappi",
                "Globant",
                "Mercado Libre",
                "Falabella",
                "Sura",
                "Bancolombia",
                "Ecopetrol",
              ].map((item) => (
                <li key={item} onClick={() => handleSelect(item)}>
                  {item}
                  <span className="arrow-item">&rsaquo;</span>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Empresas;
