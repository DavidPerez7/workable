import React from 'react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../components/Footer/Footer';
import './AdminPage.css';

function AdminPage() {
  return (
    <>
      <HeaderAdmin />
      <main className='main-admin-AD'>
        <div className="main-content-admin-AD">

          <div className="column-left-admin-AD">
            <section className="section-overview-AD">
              <h2 className="title-section-AD">Panel de Administración</h2>
              <div className="overview-stats-AD">
                <div className="stat-item-AD">
                  <h3 className="stat-number-AD">7.1M</h3>
                  <p className="stat-label-AD">Usuarios Registrados</p>
                </div>
                <div className="stat-item-AD">
                  <h3 className="stat-number-AD">11.2K</h3>
                  <p className="stat-label-AD">Empresas Activas</p>
                </div>
                <div className="stat-item-AD">
                  <h3 className="stat-number-AD">8.9K</h3>
                  <p className="stat-label-AD">Ofertas Publicadas</p>
                </div>
                <div className="stat-item-AD">
                  <h3 className="stat-number-AD">23</h3>
                  <p className="stat-label-AD">Reportes Pendientes</p>
                </div>
              </div>
            </section>

            <section className="section-actions-AD">
              <h2 className="title-section-AD">Acciones Rápidas</h2>
              <div className="action-buttons-AD">
                <Link to="/Admin/Empresas" className="button-action-AD">Gestionar Empresas</Link>
                <Link to="/Admin/Ofertas" className="button-action-AD">Gestionar Ofertas</Link>
                <Link to="/Admin/Usuarios" className="button-action-AD">Gestionar Usuarios</Link>
                <Link to="/Admin/Reportes" className="button-action-AD">Ver Reportes</Link>
                <Link to="/Admin/CuentasInternas" className="button-action-AD">Cuentas Internas</Link>
                <Link to="/Admin/Retroalimentacion" className="button-action-AD">Retroalimentación</Link>
              </div>
            </section>
          </div>

          <div className="column-right-admin-AD">
            <section className="section-list-companies-AD">
              <div className="header-list-AD">
                <h2 className="title-section-AD">Listado de Empresas</h2>
                <Link to="/Admin/Empresas" className="button-add-AD">Ver Todas</Link>
              </div>
              <div className="table-container-AD">
                <table className="data-table-AD">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>NIT</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Coca-Cola S.A.</td>
                      <td>900123456</td>
                      <td>
                        <Link to="/Admin/Empresas/1" className="button-action-small-AD">Ver</Link>
                        <button className="button-delete-small-AD">Eliminar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Google Ltda.</td>
                      <td>800789123</td>
                      <td>
                        <Link to="/Admin/Empresas/2" className="button-action-small-AD">Ver</Link>
                        <button className="button-delete-small-AD">Eliminar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="section-list-offers-AD">
              <div className="header-list-AD">
                <h2 className="title-section-AD">Últimas Ofertas</h2>
                <Link to="/Admin/Ofertas" className="button-add-AD">Ver Todas</Link>
              </div>
              <div className="list-items-AD">
                <div className="list-item-AD">Desarrollador Frontend (Reportada) <Link to="/Admin/Reportes" className="button-delete-small-AD">Ver Reporte</Link></div> {/* Enlace a página de reportes */}
                <div className="list-item-AD">Diseñador UX/UI <Link to="/Admin/Ofertas" className="button-action-small-AD">Ver</Link></div>
                <div className="list-item-AD">Especialista en Marketing (Reportada) <Link to="/Admin/Reportes" className="button-delete-small-AD">Ver Reporte</Link></div>
              </div>
            </section>

            <section className="section-list-users-AD">
              <div className="header-list-AD">
                <h2 className="title-section-AD">Usuarios Reportados</h2>
                <Link to="/Admin/Reportes" className="button-add-AD">Ver Todos</Link>
              </div>
              <div className="list-items-AD">
                <div className="list-item-AD">Usuario123 (Comentario inapropiado) <Link to="/Admin/Reportes" className="button-delete-small-AD">Ver Reporte</Link></div>
                <div className="list-item-AD">Pepito_Perez (Oferta discriminatoria) <Link to="/Admin/Reportes" className="button-delete-small-AD">Ver Reporte</Link></div>
                <div className="list-item-AD">Maria_Gomez (Spam) <Link to="/Admin/Reportes" className="button-delete-small-AD">Ver Reporte</Link></div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminPage;