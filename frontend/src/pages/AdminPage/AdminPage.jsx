import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../components/Footer/footer';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();

  const adminCards = [
    {
      id: 1,
      title: 'Gestión de Empresas',
      description: 'Aprobar, rechazar y gestionar las empresas registradas en la plataforma',
      icon: '🏢',
      route: '/Administrador/Empresas',
      color: '#4F46E5'
    },
    {
      id: 2,
      title: 'Gestión de Aspirantes',
      description: 'Administrar cuentas de aspirantes y verificar su información',
      icon: '👥',
      route: '/Administrador/Usuarios',
      color: '#059669'
    },
    {
      id: 3,
      title: 'Gestión de Ofertas',
      description: 'Supervisar y moderar las ofertas laborales publicadas',
      icon: '💼',
      route: '/Administrador/Ofertas',
      color: '#DC2626'
    },
    {
      id: 4,
      title: 'Reportes y Estadísticas',
      description: 'Visualizar métricas y estadísticas de la plataforma',
      icon: '📊',
      route: '/Administrador/Reportes',
      color: '#9333EA'
    },
    {
      id: 5,
      title: 'Cuentas de Administrador',
      description: 'Gestionar cuentas de administradores de la plataforma',
      icon: '⚙️',
      route: '/Administrador/CuentasInternas',
      color: '#0891B2'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-admin-page-AP">
        <div className="container-admin-page-AP">
          <div className="welcome-section-AP">
            <h1 className="title-admin-AP">Panel de Administración</h1>
            <p className="subtitle-admin-AP">
              Bienvenido al panel de control. Desde aquí puedes gestionar todos los aspectos de la plataforma Workable.
            </p>
          </div>

          <div className="cards-grid-AP">
            {adminCards.map((card) => (
              <div
                key={card.id}
                className="admin-card-AP"
                onClick={() => handleCardClick(card.route)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCardClick(card.route);
                }}
                style={{ '--card-color': card.color }}
              >
                <div className="card-icon-AP">{card.icon}</div>
                <h3 className="card-title-AP">{card.title}</h3>
                <p className="card-description-AP">{card.description}</p>
                <div className="card-arrow-AP">→</div>
              </div>
            ))}
          </div>

          <div className="quick-stats-AP">
            <h2 className="stats-title-AP">Resumen General</h2>
            <div className="stats-grid-AP">
              <div className="stat-item-AP">
                <div className="stat-number-AP">45</div>
                <div className="stat-label-AP">Empresas Activas</div>
              </div>
              <div className="stat-item-AP">
                <div className="stat-number-AP">328</div>
                <div className="stat-label-AP">Aspirantes Registrados</div>
              </div>
              <div className="stat-item-AP">
                <div className="stat-number-AP">156</div>
                <div className="stat-label-AP">Ofertas Publicadas</div>
              </div>
              <div className="stat-item-AP">
                <div className="stat-number-AP">12</div>
                <div className="stat-label-AP">Empresas Pendientes</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminPage;