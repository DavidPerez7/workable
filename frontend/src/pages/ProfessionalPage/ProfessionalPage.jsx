import React from 'react';
import { Link } from 'react-router-dom';
import './ProfessionalPage.css';
import Header from '../../components/Header/Header';

function ProfessionalPage() {
  return (
    <>
      <Header />
      
      <div className='SeccionTitu'>
        <h2>
          Desarrollo profesional
        </h2>
      </div>

      <section className='Articulo'>
        <div className='ArticleContent'>
          <h3>
            Qué llevar a una entrevista de trabajo
          </h3>
          <p>
            Asistir a una entrevista de trabajo bien preparado puede marcar la diferencia entre causar una excelente impresión o quedar en el olvido. No solo se trata de vestirse adecuadamente y conocer la empresa, sino también de llevar ciertos elementos clave que pueden ayudarte a destacarte como candidato.
          </p>
        </div>
        <div className='ImgSec'>
          <img className='EntrevistaImg' src='https://img.freepik.com/foto-gratis/grupo-personas-sentadas-sala-espera_273609-10953.jpg?uid=R175187634&semt=ais_hybrid&w=740' alt='Entrevista' />
        </div>
      </section>

      <div className='ArticuloTitle'>
        <h4 className='Txt2'>
          Artículos más leídos
        </h4>
      </div>

      <section className='Articulo2'>
        <div className='img1'>
          <img className='ImgEn1' src='https://img.freepik.com/foto-gratis/colegas-entrevistando-nuevo-candidato-concepto-entrevista-trabajo_329181-12389.jpg?uid=R175187634&semt=ais_hybrid&w=740' alt='Woman thinking' />
          <h6>
            Te hacen una contraoferta en un trabajo que ibas a dejar. ¿Y ahora, qué?
          </h6>
          <p>
            ¿Tu empresa actual quiere retenerte con una contraoferta? Descubre las claves para analizar esta oportunidad y tomar una decisión que impulse tu carrera profesional a largo plazo.
          </p>
        </div>
        <div className='img1'>
          <img className='ImgEn1' src='https://img.freepik.com/foto-gratis/empresario-empresaria-sentado-frente-gerente-lugar-trabajo_23-2147857315.jpg?uid=R175187634&semt=ais_hybrid&w=740' alt='Interview' />
          <h6>
            ¿Qué evalúan en cada entrevista de trabajo?
          </h6>
          <p>
            ¿Qué buscan los entrevistadores en cada etapa del proceso? Descubre los secretos de los reclutadores y aprende cómo los empleadores evalúan tu experiencia, habilidades y personalidad.
          </p>
        </div>
        <div className='img1'>
          <img className='ImgEn1' src='https://img.freepik.com/foto-gratis/joven-estudiante-frustrada-estresada-mirando-laptop-leyendo-malas-noticias-internet-correo-electronico-sintiendose-triste-cansada-trabajo-estudio-linea-molesta-problema-resultados-examenes-fallidos-aprendizaje-dificil_231208-13959.jpg?uid=R175187634&semt=ais_hybrid&w=740' alt='Woman working' />
          <h6>
            Por qué no encuentro trabajo: identifica y supera los obstáculos
          </h6>
          <p>
            ¿Pasas tiempo buscando trabajo y no llegan las oportunidades? Identifica las posibles causas y aprende a superarlas para mejorar tu perfil.
          </p>
        </div>
      </section>

      <div className='TituloSecc3'>
        <h5>
          Recursos y plantillas
        </h5>
        <p>Consejos, ejemplos y modelos para conseguir que tus postulaciones destaquen</p>
      </div>
      <section className='Articulo3'>
        <div className='CuadrSecc'>
          <h6>
            Planifica tu carrera
          </h6>
          <p>
            Consigue el trabajo que siempre soñaste. Explora aquí cargos y salarios y planea tus próximos pasos.
          </p>
        </div>
        <div className='SeccionTxt'>
          <div className='TxtSecc'>
            <p>
              Encuentra consejos prácticos, ejemplos reales de CVs y cartas de presentación exitosas, además de modelos y plantillas personalizables para optimizar tus documentos y captar la atención de los equipos reclutadores
            </p>
            <button><Link to="/Articulo1">Palabras claves en un CV</Link></button>
            <button><Link to="/Articulo2">Como crear una carta de presentacion</Link></button>
            <button><Link to="/Articulo3">Hacer un CV exitoso</Link></button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfessionalPage;