import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/footer';
import './ReportPage.css';

function ReportPage() {
  const navigate = useNavigate();
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');


  const estadisticasGenerales = {
    totalUsuarios: 328,
    nuevosUsuarios: 45,
    totalEmpresas: 45,
    nuevasEmpresas: 8,
    totalOfertas: 156,
    nuevasOfertas: 23,
    totalPostulaciones: 1247,
    nuevasPostulaciones: 189,
    tasaActivacion: 87.5,
    tasaPostulacion: 76.2
  };


  const registrosPorMes = [
    { mes: 'Ene', aspirantes: 28, empresas: 5 },
    { mes: 'Feb', aspirantes: 32, empresas: 4 },
    { mes: 'Mar', aspirantes: 41, empresas: 6 },
    { mes: 'Abr', aspirantes: 38, empresas: 7 },
    { mes: 'May', aspirantes: 45, empresas: 5 },
    { mes: 'Jun', aspirantes: 52, empresas: 8 },
    { mes: 'Jul', aspirantes: 48, empresas: 6 },
    { mes: 'Ago', aspirantes: 44, empresas: 4 }
  ];


  const topCategorias = [
    { nombre: 'TECNOLOGIA', ofertas: 58, porcentaje: 37.2 },
    { nombre: 'COMERCIO', ofertas: 35, porcentaje: 22.4 },
    { nombre: 'FINANZAS', ofertas: 28, porcentaje: 17.9 },
    { nombre: 'SALUD', ofertas: 20, porcentaje: 12.8 },
    { nombre: 'EDUCACION', ofertas: 15, porcentaje: 9.6 }
  ];


  const topCiudades = [
    { ciudad: 'Bogotá D.C', usuarios: 145, empresas: 18, ofertas: 67 },
    { ciudad: 'Medellín', usuarios: 98, empresas: 12, ofertas: 42 },
    { ciudad: 'Cali', usuarios: 52, empresas: 8, ofertas: 28 },
    { ciudad: 'Barranquilla', usuarios: 33, empresas: 7, ofertas: 19 }
  ];


  const ofertasPopulares = [
    { titulo: 'Desarrollador Full Stack', empresa: 'SoftCorp', postulaciones: 78 },
    { titulo: 'Ingeniero de Datos', empresa: 'DataTech', postulaciones: 65 },
    { titulo: 'Diseñador UX/UI', empresa: 'DesignHub', postulaciones: 54 },
    { titulo: 'Analista Financiero', empresa: 'FinanzasPro', postulaciones: 48 },
    { titulo: 'Enfermero Profesional', empresa: 'HealthCare', postulaciones: 42 }
  ];

  const handleExportarPDF = () => {
    alert('Exportando reporte en PDF...');
  };

  const handleExportarExcel = () => {
    alert('Exportando reporte en Excel...');
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-report-page-RP">
        <div className="container-report-page-RP">
          

          <div className="header-section-RP">
            <div>
              <h1 className="title-report-RP">Reportes y Estadísticas</h1>
              <p className="subtitle-report-RP">
                Visualiza métricas y análisis detallados de la plataforma
              </p>
            </div>
            <div className="header-actions-RP">
              <select 
                className="periodo-select-RP"
                value={periodoSeleccionado}
                onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              >
                <option value="semana">Última semana</option>
                <option value="mes">Último mes</option>
                <option value="trimestre">Último trimestre</option>
                <option value="año">Último año</option>
              </select>
              <button className="btn-export-RP" onClick={handleExportarPDF}>
                📄 Exportar PDF
              </button>
              <button className="btn-export-RP" onClick={handleExportarExcel}>
                📊 Exportar Excel
              </button>
              <button 
                className="btn-back-RP"
                onClick={() => navigate('/Administrador')}
              >
                ← Volver
              </button>
            </div>
          </div>

          <div className="main-stats-RP">
            <div className="stat-card-large-RP stat-usuarios-RP">
              <div className="stat-icon-large-RP">👥</div>
              <div className="stat-content-RP">
                <div className="stat-number-large-RP">{estadisticasGenerales.totalUsuarios}</div>
                <div className="stat-label-large-RP">Total Aspirantes</div>
                <div className="stat-change-RP positive">+{estadisticasGenerales.nuevosUsuarios} este mes</div>
              </div>
            </div>

            <div className="stat-card-large-RP stat-empresas-RP">
              <div className="stat-icon-large-RP">🏢</div>
              <div className="stat-content-RP">
                <div className="stat-number-large-RP">{estadisticasGenerales.totalEmpresas}</div>
                <div className="stat-label-large-RP">Total Empresas</div>
                <div className="stat-change-RP positive">+{estadisticasGenerales.nuevasEmpresas} este mes</div>
              </div>
            </div>

            <div className="stat-card-large-RP stat-ofertas-RP">
              <div className="stat-icon-large-RP">💼</div>
              <div className="stat-content-RP">
                <div className="stat-number-large-RP">{estadisticasGenerales.totalOfertas}</div>
                <div className="stat-label-large-RP">Total Ofertas</div>
                <div className="stat-change-RP positive">+{estadisticasGenerales.nuevasOfertas} este mes</div>
              </div>
            </div>

            <div className="stat-card-large-RP stat-postulaciones-RP">
              <div className="stat-icon-large-RP">📝</div>
              <div className="stat-content-RP">
                <div className="stat-number-large-RP">{estadisticasGenerales.totalPostulaciones}</div>
                <div className="stat-label-large-RP">Total Postulaciones</div>
                <div className="stat-change-RP positive">+{estadisticasGenerales.nuevasPostulaciones} este mes</div>
              </div>
            </div>
          </div>


          <div className="charts-section-RP">
            

            <div className="chart-card-RP">
              <h3 className="chart-title-RP">Registros Mensuales</h3>
              <div className="bar-chart-RP">
                {registrosPorMes.map((data, index) => (
                  <div key={index} className="bar-group-RP">
                    <div className="bars-container-RP">
                      <div 
                        className="bar-RP bar-aspirantes-RP" 
                        style={{ height: `${data.aspirantes * 2}px` }}
                        title={`${data.aspirantes} aspirantes`}
                      ></div>
                      <div 
                        className="bar-RP bar-empresas-RP" 
                        style={{ height: `${data.empresas * 12}px` }}
                        title={`${data.empresas} empresas`}
                      ></div>
                    </div>
                    <div className="bar-label-RP">{data.mes}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend-RP">
                <span className="legend-item-RP">
                  <span className="legend-color-RP legend-aspirantes-RP"></span>
                  Aspirantes
                </span>
                <span className="legend-item-RP">
                  <span className="legend-color-RP legend-empresas-RP"></span>
                  Empresas
                </span>
              </div>
            </div>


            <div className="chart-card-RP">
              <h3 className="chart-title-RP">Categorías Más Populares</h3>
              <div className="categories-list-RP">
                {topCategorias.map((cat, index) => (
                  <div key={index} className="category-item-RP">
                    <div className="category-info-RP">
                      <span className="category-rank-RP">#{index + 1}</span>
                      <span className="category-name-RP">{cat.nombre}</span>
                    </div>
                    <div className="category-stats-RP">
                      <div className="progress-bar-RP">
                        <div 
                          className="progress-fill-RP"
                          style={{ width: `${cat.porcentaje}%` }}
                        ></div>
                      </div>
                      <span className="category-count-RP">{cat.ofertas} ofertas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="additional-metrics-RP">


            <div className="metric-card-RP">
              <h3 className="metric-title-RP">🌆 Top Ciudades</h3>
              <div className="cities-table-RP">
                <table>
                  <thead>
                    <tr>
                      <th>Ciudad</th>
                      <th>Usuarios</th>
                      <th>Empresas</th>
                      <th>Ofertas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCiudades.map((ciudad, index) => (
                      <tr key={index}>
                        <td className="city-name-RP">{ciudad.ciudad}</td>
                        <td>{ciudad.usuarios}</td>
                        <td>{ciudad.empresas}</td>
                        <td>{ciudad.ofertas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="metric-card-RP">
              <h3 className="metric-title-RP">🔥 Ofertas Más Postuladas</h3>
              <div className="popular-offers-RP">
                {ofertasPopulares.map((oferta, index) => (
                  <div key={index} className="popular-offer-item-RP">
                    <div className="offer-rank-badge-RP">#{index + 1}</div>
                    <div className="offer-info-RP">
                      <div className="offer-title-popular-RP">{oferta.titulo}</div>
                      <div className="offer-company-RP">{oferta.empresa}</div>
                    </div>
                    <div className="offer-applications-RP">
                      {oferta.postulaciones} <span>postulaciones</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="metric-card-RP">
              <h3 className="metric-title-RP">📈 Tasas de Conversión</h3>
              <div className="conversion-metrics-RP">
                <div className="conversion-item-RP">
                  <div className="conversion-label-RP">Tasa de Activación de Usuarios</div>
                  <div className="conversion-value-RP">{estadisticasGenerales.tasaActivacion}%</div>
                  <div className="conversion-bar-RP">
                    <div 
                      className="conversion-fill-RP conversion-success-RP"
                      style={{ width: `${estadisticasGenerales.tasaActivacion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="conversion-item-RP">
                  <div className="conversion-label-RP">Tasa de Postulación</div>
                  <div className="conversion-value-RP">{estadisticasGenerales.tasaPostulacion}%</div>
                  <div className="conversion-bar-RP">
                    <div 
                      className="conversion-fill-RP conversion-info-RP"
                      style={{ width: `${estadisticasGenerales.tasaPostulacion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ReportPage;