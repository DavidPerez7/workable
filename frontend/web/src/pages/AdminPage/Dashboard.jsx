import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const shortcuts = [
    { title: 'Aspirantes', description: 'Gestiona usuarios aspirantes, estados y eliminación.', path: '/Administrador/Aspirantes' },
    { title: 'Administradores', description: 'Crea y administra accesos internos.', path: '/Administrador/Administradores' },
    { title: 'Reclutadores', description: 'Supervisa las cuentas de reclutador.', path: '/Administrador/Reclutadores' },
    { title: 'Empresas', description: 'Revisa y edita empresas registradas.', path: '/Administrador/Empresas' },
    { title: 'Ofertas', description: 'Modera vacantes publicadas.', path: '/Administrador/Ofertas' },
    { title: 'Postulaciones', description: 'Consulta el flujo de postulaciones.', path: '/Administrador/Postulaciones' },
    { title: 'Hojas de vida', description: 'Verifica la información profesional.', path: '/Administrador/HojasDeVida' },
    { title: 'Municipios', description: 'Mantén los catálogos base actualizados.', path: '/Administrador/Municipios' },
  ];

  return (
    <section className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <h1>Panel administrativo</h1>
          <p className="dashboard-subtitle">Accesos directos a las tareas clave del administrador.</p>
        </div>
      </div>

      <div className="dashboard-panels">
        <article className="panel panel-highlight">
          <h2>Funciones clave</h2>
          <p className="dashboard-state">
            El panel administrativo concentra la moderación de usuarios, empresas, ofertas y postulaciones.
            Usa los accesos rápidos para entrar directo a cada módulo.
          </p>
          <div className="quick-actions">
            <button className="btn-quick" onClick={() => navigate('/Administrador/Empresas')}>Empresas</button>
            <button className="btn-quick" onClick={() => navigate('/Administrador/Ofertas')}>Ofertas</button>
            <button className="btn-quick" onClick={() => navigate('/Administrador/Postulaciones')}>Postulaciones</button>
          </div>
        </article>

        <article className="panel">
          <h2>Módulos administrativos</h2>
          <div className="dashboard-links">
            {shortcuts.map((shortcut) => (
              <button
                key={shortcut.title}
                type="button"
                className="dashboard-link-card"
                onClick={() => navigate(shortcut.path)}
              >
                <strong>{shortcut.title}</strong>
                <span>{shortcut.description}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Enfoque según RF</h2>
          <div className="mini-list">
            <div>Moderación de contenido y usuarios</div>
            <div>Gestión de empresas y vacantes</div>
            <div>Seguimiento de postulaciones</div>
            <div>Administración de catálogos base</div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;
