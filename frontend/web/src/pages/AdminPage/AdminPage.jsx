import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AdminUsuarios from './AdminUsuarios';
import AdminEmpresa from './AdminEmpresas';
import OffersPage from './AdminOfertas';
import AdminPostulaciones from './AdminPostulaciones';
import AdminAdministradores from './AdminAdministradores';
import AdminReclutadores from './AdminReclutadores';
import AdminMunicipios from './AdminMunicipios';
import AdminHojasDeVida from './AdminHojasDeVida';
import './CrudEntityPage/CrudEntityPage.css';
import './AdminPage.css';

function AdminPage() {
  return (
    <div className="admin-page-shell">
      <HeaderAdmin />
      <div className="admin-shell">
        <Sidebar />
        <div className="admin-content">
          <main className="admin-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Aspirantes" element={<AdminUsuarios />} />
              <Route path="/Usuarios" element={<AdminUsuarios />} />
              <Route path="/Administradores" element={<AdminAdministradores />} />
              <Route path="/Reclutadores" element={<AdminReclutadores />} />
              <Route path="/Empresas" element={<AdminEmpresa />} />
              <Route path="/Ofertas" element={<OffersPage />} />
              <Route path="/Postulaciones" element={<AdminPostulaciones />} />
              <Route path="/HojasDeVida" element={<AdminHojasDeVida />} />
              <Route path="/Municipios" element={<AdminMunicipios />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;