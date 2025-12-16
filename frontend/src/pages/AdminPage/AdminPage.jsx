import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import Sidebar from './SideBar/Sidebar';
import Dashboard from './DashBoard/Dashboard';
import AdminUsuarios from './AdminUsuarios/AdminUsuarios';
import AdminEmpresa from './AdminEmpresas/AdminEmpresas';
import OffersPage from './AdminOfertas/AdminOfertas';
import AdminPostulaciones from './AdminPostulaciones/AdminPostulaciones';
import './AdminPage.css';

function AdminPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <main className="main-admin-page-AP">
          <div className="container-admin-page-AP">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Usuarios" element={<AdminUsuarios />} />
              <Route path="/Empresas" element={<AdminEmpresa />} />
              <Route path="/Ofertas" element={<OffersPage />} />
              <Route path="/Postulaciones" element={<AdminPostulaciones />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AdminPage;