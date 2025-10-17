import React from 'react';
import './Empresas.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

function Empresas() {
  const navigate = useNavigate();

  const Exit = () => {
    navigate('/HomePage');
  };

  return (
    <>
    <Header />

        <main className="main-empresas">
        <h1>Descubre las mejores empresas según su sector</h1>

        <div className="empresas-forms">
          <section className="form-section">
            <h2>Empresas por sectores</h2>
            <ul className="empresa-list">
              <li>Tecnología <span>&rsaquo;</span></li>
              <li>Salud <span>&rsaquo;</span></li>
              <li>Educación <span>&rsaquo;</span></li>
              <li>Finanzas <span>&rsaquo;</span></li>
              <li>Logística <span>&rsaquo;</span></li>
              <li>Alimentos <span>&rsaquo;</span></li>
              <li>Entretenimiento <span>&rsaquo;</span></li>
              <li>Automotriz <span>&rsaquo;</span></li>
            </ul>
          </section>

          <section className="form-section">
            <h2>Empresas con más seguidores</h2>
            <ul className="empresa-list">
              <li>Google <span>&rsaquo;</span></li>
              <li>Microsoft <span>&rsaquo;</span></li>
              <li>Amazon <span>&rsaquo;</span></li>
              <li>Meta <span>&rsaquo;</span></li>
              <li>Netflix <span>&rsaquo;</span></li>
              <li>Tesla <span>&rsaquo;</span></li>
              <li>Apple <span>&rsaquo;</span></li>
              <li>IBM <span>&rsaquo;</span></li>
            </ul>
          </section>

          <section className="form-section">
            <h2>Empresas recién evaluadas</h2>
            <ul className="empresa-list">
              <li>Nubank <span>&rsaquo;</span></li>
              <li>Rappi <span>&rsaquo;</span></li>
              <li>Globant <span>&rsaquo;</span></li>
              <li>Mercado Libre <span>&rsaquo;</span></li>
              <li>Falabella <span>&rsaquo;</span></li>
              <li>Sura <span>&rsaquo;</span></li>
              <li>Bancolombia <span>&rsaquo;</span></li>
              <li>Ecopetrol <span>&rsaquo;</span></li>
            </ul>
          </section>
        </div>
      </main>
    
    <Footer />
    </>
  );
}

export default Empresas;
