import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import Footer from '../../../components/Footer/Footer';
import './InfoRecPage.css';

const InfoRecPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <HeaderReclutador />
      <main className='main-info-rec-IRP'>

        <div className='header-section1-IRP'>
          <h1><Link to="/" className='link-page-IRP'>Personas</Link></h1>
          <h1 className='title-reclutadores-IRP'>Reclutadores</h1>
        </div>

        <div className='header-section2-IRP'>
          <h1 className='title-workable-IRP'>WORKABLE</h1>
          <h2 className='link-page-IRP'><Link to="/">Inicio</Link></h2>
          <button className='button-publish-offer-IRP'>
            <span>
              <Link to="/Reclutador/Publicacion">Publicar oferta</Link>
            </span>
          </button>
        </div>

        <section className='section-promo-IRP'>
          <h3 className='title-promo-IRP'>¡Publica ofertas gratis!</h3>
          <p className='text-promo-IRP'>Ahorra costos y tiempo en tus procesos de selección y consigue el candidato ideal de forma rápida y fácil</p>
          <button className='button-publish-main-IRP'>
            <span>
              <Link to="/Reclutador/Publicacion">Publicar una oferta</Link>
            </span>
          </button>
        </section>

        <section className="section-process-IRP">
          <div className="column-images-IRP">
            <img src="https://media.istockphoto.com/id/1440285048/es/foto/%C3%A9xito-visi%C3%B3n-y-orgulloso-l%C3%ADder-gerente-que-se-ve-feliz-y-sonr%C3%ADe-liderazgo-con-innovaci%C3%B3n-en-el.jpg?s=612x612&w=0&k=20&c=NA9BvKkZdocPJNsqUZzl_bPfmGzqS_BUj00SZazloCs=" alt="Persona 1" className="image-process-IRP" />
            <img src="https://media.istockphoto.com/id/1754234512/es/foto/empresario-hombre-y-brazos-cruzados-en-un-taller-con-sonrisa-y-confianza-para-el-retrato-en.jpg?s=612x612&w=0&k=20&c=IDLiVjG-l8IEqA2NPTP_5Jqyk7boFGp0ubc_WGm44ks=" alt="Persona 2" className="image-process-IRP image-bottom-IRP" />
          </div>

          <div className="column-steps-IRP">
            <div className="process-step-IRP">
              <div className="step-number-IRP">1</div>
              <div>
                <h4 className='step-title-IRP'>Publica tu vacante</h4>
                <p className='step-text-IRP'>Crea fácilmente tu oferta de trabajo y publícala en un click.</p>
              </div>
            </div>
            <div className="process-step-IRP">
              <div className="step-number-IRP">2</div>
              <div>
                <h4 className='step-title-IRP'>Revisa las aplicaciones</h4>
                <p className='step-text-IRP'>Selecciona a los mejores candidatos entre todos CVs recibicidos.</p>
              </div>
            </div>
            <div className="process-step-IRP">
              <div className="step-number-IRP">3</div>
              <div>
                <h4 className='step-title-IRP'>Contrata</h4>
                <p className='step-text-IRP'>Encuentra al candidato que mejor se adapta al perfil buscado.</p>
              </div>
            </div>
          </div>
        </section>

        <section className='section-cta-middle-IRP'>
            <h3 className='title-cta-middle-IRP'>Publica tu oferta</h3>
            <p className='text-cta-middle-IRP'>seran tus 5 minutos de hoy mejor invertidos</p>
          <button className='button-find-candidates-IRP'>
            <span><Link to="/Reclutador/Publicacion">Encontrar candidatos</Link></span>
          </button>
        </section>

        <section className="section-features-IRP">
          <div className="feature-card-IRP">
            <div className="icon-circle-IRP green-IRP">
              <svg className="icon-svg-IRP" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </div>
            <h3 className='feature-title-IRP'>Atrae al candidato que necesitas</h3>
            <p className='feature-text-IRP'>Enumera las habilidades necesarias para el empleo para que puedan aplicarse candidatos pertinentes.</p>
          </div>

          <div className="feature-card-IRP">
            <div className="icon-circle-IRP yellow-IRP">
              <svg className="icon-svg-IRP" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className='feature-title-IRP'>Verifica sus habilidades</h3>
            <p className='feature-text-IRP'>Personaliza el proceso de selección de cada oferta: definición de etapas, test y mucho más.</p>
          </div>

          <div className="feature-card-IRP">
            <div className="icon-circle-IRP red-IRP">
              <svg className="icon-svg-IRP" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5-6l3 3-3 3" />
              </svg>
            </div>
            <h3 className='feature-title-IRP'>Organiza tus candidatos</h3>
            <p className='feature-text-IRP'>Ordena los CV, envía mensajes y entrevístalos, todo en la web de empleo más utilizada en Latinoamérica.</p>
          </div>
        </section>

        <div className='container-cta-bottom-IRP'>
          <button className='button-start-now-IRP'>
            <span>
              <Link to="/Reclutador/Publicacion">Comenzar ahora</Link>
            </span>
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default InfoRecPage;