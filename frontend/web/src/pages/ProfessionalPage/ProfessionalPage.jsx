import React from 'react';
import { Link } from 'react-router-dom';
import './ProfessionalPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/footer';

function ProfessionalPage() {
  return (
    <>
      <Header />
      
      <main className="professional-main">
        <section className="professional-hero">
          <div className="hero-content-professional">
            <span className="professional-badge">Guía de Carrera</span>
            <h1 className="professional-title">Desarrollo Profesional</h1>
            <p className="professional-subtitle">
              Consejos, recursos y herramientas para impulsar tu carrera al siguiente nivel
            </p>
          </div>
        </section>

        {/* Featured Article */}
        <section className="featured-section">
          <div className="container-professional">
            <div className="featured-content">
              <div className="featured-text">
                <span className="featured-label">Destacado</span>
                <h2 className="featured-title">
                  Qué llevar a una entrevista de trabajo
                </h2>
                <p className="featured-description">
                  Asistir a una entrevista de trabajo bien preparado puede marcar la diferencia entre causar una excelente impresión o quedar en el olvido. No solo se trata de vestirse adecuadamente y conocer la empresa, sino también de llevar ciertos elementos clave que pueden ayudarte a destacarte como candidato.
                </p>
                <Link to="/articulo-entrevista" className="featured-link">
                  Leer más
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
              <div className="featured-image">
                <img 
                  src='https://img.freepik.com/foto-gratis/grupo-personas-sentadas-sala-espera_273609-10953.jpg?uid=R175187634&semt=ais_hybrid&w=740' 
                  alt='Entrevista de trabajo' 
                  className="featured-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Most Read Articles */}
        <section className="articles-section">
          <div className="container-professional">
            <div className="section-header-pro">
              <h2 className="section-title-pro">Artículos más leídos</h2>
              <p className="section-desc-pro">
                Descubre los contenidos más populares entre nuestra comunidad
              </p>
            </div>

            <div className="articles-grid">
              <article className="article-card">
                <div className="article-image-wrapper">
                  <img 
                    src='https://img.freepik.com/foto-gratis/colegas-entrevistando-nuevo-candidato-concepto-entrevista-trabajo_329181-12389.jpg?uid=R175187634&semt=ais_hybrid&w=740' 
                    alt='Contraoferta laboral' 
                    className="article-img"
                  />
                </div>
                <div className="article-content">
                  <h3 className="article-title">
                    Te hacen una contraoferta en un trabajo que ibas a dejar. ¿Y ahora, qué?
                  </h3>
                  <p className="article-excerpt">
                    ¿Tu empresa actual quiere retenerte con una contraoferta? Descubre las claves para analizar esta oportunidad y tomar una decisión que impulse tu carrera profesional a largo plazo.
                  </p>
                  <Link to="/articulo-contraoferta" className="article-link">
                    Leer artículo
                  </Link>
                </div>
              </article>

              <article className="article-card">
                <div className="article-image-wrapper">
                  <img 
                    src='https://img.freepik.com/foto-gratis/empresario-empresaria-sentado-frente-gerente-lugar-trabajo_23-2147857315.jpg?uid=R175187634&semt=ais_hybrid&w=740' 
                    alt='Evaluación en entrevista' 
                    className="article-img"
                  />
                </div>
                <div className="article-content">
                  <h3 className="article-title">
                    ¿Qué evalúan en cada entrevista de trabajo?
                  </h3>
                  <p className="article-excerpt">
                    ¿Qué buscan los entrevistadores en cada etapa del proceso? Descubre los secretos de los reclutadores y aprende cómo los empleadores evalúan tu experiencia, habilidades y personalidad.
                  </p>
                  <Link to="/articulo-evaluacion" className="article-link">
                    Leer artículo
                  </Link>
                </div>
              </article>

              <article className="article-card">
                <div className="article-image-wrapper">
                  <img 
                    src='https://img.freepik.com/foto-gratis/joven-estudiante-frustrada-estresada-mirando-laptop-leyendo-malas-noticias-internet-correo-electronico-sintiendose-triste-cansada-trabajo-estudio-linea-molesta-problema-resultados-examenes-fallidos-aprendizaje-dificil_231208-13959.jpg?uid=R175187634&semt=ais_hybrid&w=740' 
                    alt='Búsqueda de empleo' 
                    className="article-img"
                  />
                </div>
                <div className="article-content">
                  <h3 className="article-title">
                    Por qué no encuentro trabajo: identifica y supera los obstáculos
                  </h3>
                  <p className="article-excerpt">
                    ¿Pasas tiempo buscando trabajo y no llegan las oportunidades? Identifica las posibles causas y aprende a superarlas para mejorar tu perfil.
                  </p>
                  <Link to="/articulo-obstaculos" className="article-link">
                    Leer artículo
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="resources-section">
          <div className="container-professional">
            <div className="section-header-pro">
              <h2 className="section-title-pro">Recursos y plantillas</h2>
              <p className="section-desc-pro">
                Consejos, ejemplos y modelos para conseguir que tus postulaciones destaquen
              </p>
            </div>

            <div className="resources-grid">
              <div className="resource-highlight">
                <div className="resource-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="resource-title">Planifica tu carrera</h3>
                <p className="resource-description">
                  Consigue el trabajo que siempre soñaste. Explora aquí cargos y salarios y planea tus próximos pasos.
                </p>
              </div>

              <div className="resource-list">
                <p className="resource-intro">
                  Encuentra consejos prácticos, ejemplos reales de CVs y cartas de presentación exitosas, además de modelos y plantillas personalizables para optimizar tus documentos y captar la atención de los equipos reclutadores.
                </p>
                <div className="resource-buttons">
                  <Link to="/Articulo1" className="resource-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Palabras claves en un CV
                  </Link>
                  <Link to="/Articulo2" className="resource-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Cómo crear una carta de presentación
                  </Link>
                  <Link to="/Articulo3" className="resource-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Hacer un CV exitoso
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProfessionalPage;