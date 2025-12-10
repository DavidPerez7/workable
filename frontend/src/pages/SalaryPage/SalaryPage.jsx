import React, { useState } from 'react';
import './SalaryPage.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/footer';

function SalaryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const Exit = () => {
    navigate('/');
  };

  const handleSearch = () => {
    console.log('Buscando:', searchTerm);
  };

  return (
    <>
      <Header />
      <main className="salary-main">
        {/* Hero Section */}
        <section className="salary-hero">
          <div className="salary-hero-content">
            <span className="salary-badge">Información Salarial</span>
            <h1 className="salary-main-title">
              Evalúa los salarios promedio de tu sector
            </h1>
            <p className="salary-subtitle">
              Compara más de 4.179.960 sueldos registrados y toma decisiones informadas sobre tu carrera
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="salary-search-section">
          <div className="container-salary">
            <div className="search-wrapper-salary">
              <svg className="search-icon-salary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                type="text" 
                placeholder="Buscar empresa o cargo..." 
                className="search-input-salary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn-search-salary" onClick={handleSearch}>
                Buscar Salarios
              </button>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="salary-filters-section">
          <div className="container-salary">
            <div className="filters-grid">
              
              {/* Salarios por Categoría */}
              <div className="filter-card">
                <div className="filter-header">
                  <div className="filter-icon blue-bg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <h2 className="filter-title">Salarios por categoría</h2>
                </div>
                <div className="filter-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Ventas</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Administración/Oficina</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Almacén/Logística</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Medicina/Salud</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Otros</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Producción/Operaciones</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Servicios Generales</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Atención a clientes</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Informática/Telecomunicaciones</span>
                  </label>
                  <label className="checkbox-label view-all">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Ver todas las categorías</span>
                  </label>
                </div>
              </div>

              {/* Salarios Más Buscados */}
              <div className="filter-card">
                <div className="filter-header">
                  <div className="filter-icon amber-bg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </div>
                  <h2 className="filter-title">Salarios más buscados</h2>
                </div>
                <div className="filter-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Comercial asesor</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Auxiliar contable</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Auxiliar de bodega</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Call center</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Servicio al cliente</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Operario/a</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Asesor comercial</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Telecomunicaciones</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Técnico/a</span>
                  </label>
                </div>
              </div>

              {/* Salarios Directivos */}
              <div className="filter-card">
                <div className="filter-header">
                  <div className="filter-icon green-bg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </div>
                  <h2 className="filter-title">Salarios directivos</h2>
                </div>
                <div className="filter-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Médico nefrólogo</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Ingenieros/as financieros/as</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Agente profesional</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Almacenista atención al cliente</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Vicepresidente/a</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Médico/especialista</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-text">Human resources</span>
                  </label>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="salary-info-section">
          <div className="container-salary">
            <div className="info-card">
              <svg className="info-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="info-content">
                <h3 className="info-title">Información salarial actualizada</h3>
                <p className="info-description">
                  Los datos salariales se actualizan constantemente con información reportada por usuarios verificados y empresas registradas en la plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

export default SalaryPage;