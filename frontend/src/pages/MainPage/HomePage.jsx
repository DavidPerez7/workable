import React, { useState } from 'react';
import { Search, Briefcase, TrendingUp, Users, Award, CheckCircle, } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    navigate(`/Aspirante?query=${encodeURIComponent(searchTerm)}`);
  };
  
  return (
    <>
      <Header />
      <main>
        {/* Hero Section con Búsqueda */}
        <section className="section-hero">
          <div className="hero-gradient-overlay"></div>
          <div className="hero-container">
            <h1 className="hero-main-title">
              Encuentra tu próxima
              <span className="hero-title-accent"> oportunidad laboral</span>
            </h1>
            
            <p className="hero-subtitle">
              Miles de ofertas de empresas verificadas esperándote. Conecta con empleadores comprometidos hoy mismo.
            </p>
            
            <div className="search-container">
              <div className="search-wrapper">
                <Search className="search-icon" size={24} />
                <input
                  className='search-input'
                  type="text"
                  placeholder="Cargo, empresa o palabra clave..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter' && handleSearchSubmit());
                  }}
                />
                <button className="search-btn" onClick={handleSearchSubmit}>
                  Buscar Empleo
                </button>
              </div>
            </div>

            <div className="hero-stats-grid">
              <div className="stat-item">
                <div className="stat-number">12,000+</div>
                <div className="stat-label">Ofertas Activas</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">800+</div>
                <div className="stat-label">Empresas Registradas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Para Empresas */}
        <section className='section-companies'>
          <div className="section-header-content">
            <span className="section-badge">Para Empresas</span>
            <h2 className="section-title">Publica ofertas gratis hoy mismo</h2>
            <p className="section-description">
              Proceso simple y efectivo para conectar con profesionales calificados
            </p>
          </div>

          <div className='steps-container'>
            <div className='step-card'>
              <div className='step-number'>01</div>
              <div className="step-icon-wrapper purple">
              <Briefcase size={32} />
            </div>
              <h3 className='step-title'>
                <Link to="/Reclutador/reclutamiento" className="step-link">
                  Publica Gratis
                </Link>
              </h3>
              <p className='step-desc'>
                Crea tu cuenta y publica ofertas ilimitadas. Llega a miles de profesionales en minutos.
              </p>
            </div>

            <div className='step-card'>
              <div className='step-number'>02</div>
              <div className="step-icon-wrapper pink">
              <Users size={32} />
            </div>
              <h3 className='step-title'>
                <Link to="/Reclutador/reclutamiento" className="step-link">
                  Selecciona
                </Link>
              </h3>
              <p className='step-desc'>
                Accede a perfiles detallados y filtra según tus necesidades empresariales específicas.
              </p>
            </div>

            <div className='step-card'>
              <div className='step-number'>03</div>
              <div className="step-icon-wrapper cyan">
              <Award size={32} />
            </div>
              <h3 className='step-title'>
                <Link to="/Reclutador/reclutamiento" className="step-link">
                  Encuentra al Mejor
                </Link>
              </h3>
              <p className='step-desc'>
                Contacta directamente al candidato ideal que mejor encaja con tu organización.
              </p>
            </div>
          </div>
        </section>

        {/* Empresas Presentes */}
        <section className="section-trusted">
          <div className="trusted-header">
            <h2 className="trusted-title">Empresas que confían en nosotros</h2>
            <p className="trusted-subtitle">
              Más de 800 empresas utilizan Workable para encontrar el mejor talento profesional
            </p>
          </div>
          
          <div className="companies-logos">
            <div className="company-card">
              <img src="data:image/png;base64,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" alt="KFC" className="company-logo" />
            </div>
            <div className="company-card">
              <img src="data:image/png;base64,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" alt="Burger King" className="company-logo" />
            </div>
            <div className="company-card">
              <img src="data:image/png;base64,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" alt="McDonald's" className="company-logo" />
            </div>
          </div>

          <div className='button-center'>
            <Link to="/Empresas" className="btn-view-all">
              Ver Todas las Empresas
            </Link>
          </div>
        </section>

        {/* Sección Aspirantes */}
        <section className='section-applicants'>
          <div className="applicants-grid">
            <div className="applicants-image">
              <img src="https://i.ibb.co/ymHWpjzF/negocios-finanzas-y-empleo-concepto-de-mujeres-emprendedoras-exitosas-confianza-empresaria-asiatica.jpg" alt="Candidatos" className='img-applicants' />
            </div>
            
            <div className="applicants-content">
              <span className="section-badge secondary-badge">Para Candidatos</span>
              <h2 className="applicants-title">
                ¡Encuentra ofertas de trabajo inclusivas!
              </h2>
              <p className="applicants-text">
                Estamos aquí para ayudarte a encontrar tu empleo ideal. Miles de ofertas inclusivas te están esperando.
              </p>
              <p className="applicants-text">
                Regístrate o inicia sesión de forma gratuita, aplica a ofertas de empresas comprometidas con la inclusión laboral.
              </p>

              <div className="benefits-list">
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>Ofertas verificadas de empresas reales</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>Proceso de postulación rápido y simple</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>Alertas personalizadas de nuevas oportunidades</span>
                </div>
              </div>

              <div className="applicants-buttons">
                <Link to="/SignUp" className='btn-primary-large'>
                  Crear Cuenta Gratis
                </Link>
                <Link to="/Aspirante" className='btn-secondary-large'>
                  Explorar Ofertas
                </Link>
              </div>
            </div>
          </div>
        </section>


        <section className="features-section">
        <div className="section-header">
          <h2 className="section-title-home">¿Por qué elegir Workable?</h2>
          <p className="section-description-home">
            La plataforma líder en conexión laboral
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon purple-bg">
              <TrendingUp size={32} />
            </div>
            <h3 className="feature-title">Amplía tu Visibilidad</h3>
            <p className="feature-description">
              Maximiza el alcance de tus ofertas entre una amplia audiencia de candidatos calificados en toda la región.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon pink-bg">
              <Users size={32} />
            </div>
            <h3 className="feature-title">Responsabilidad Social</h3>
            <p className="feature-description">
              Fortalece tu compromiso con la inclusión y responsabilidad social empresarial.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon cyan-bg">
              <Briefcase size={32} />
            </div>
            <h3 className="feature-title">Gestión Eficiente</h3>
            <p className="feature-description">
              Publica vacantes sin costos y organiza postulaciones de manera simple y efectiva.
            </p>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;