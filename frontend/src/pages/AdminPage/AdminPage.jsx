import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import Sidebar from './SideBar/Sidebar';
import Dashboard from './DashBoard/Dashboard';
import AdminUsuarios from './AdminUsuarios/AdminUsuarios';
import AdminEmpresa from './AdminEmpresas/AdminEmpresas';
import OffersPage from './AdminOfertas/AdminOfertas';
import AdminPostulaciones from './AdminPostulaciones/AdminPostulaciones';
import AdminPerfil from './AdminPerfil/AdminPerfil';
import './AdminPage.css';

function AdminPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <main className="main-admin-page-AP">
          <Routes>
            <Route path="/" element={
              <div className="container-admin-page-AP">
                <Dashboard />
              </div>
            } />
            <Route path="/Usuarios" element={
              <div className="container-admin-page-AP">
                <AdminUsuarios />
              </div>
            } />
            <Route path="/Empresas" element={
              <div className="container-admin-page-AP">
                <AdminEmpresa />
              </div>
            } />
            <Route path="/Ofertas" element={
              <div className="container-admin-page-AP">
                <OffersPage />
              </div>
            } />
            <Route path="/Postulaciones" element={<AdminPostulaciones />} />
            <Route path="/Perfil" element={
              <div className="container-admin-page-AP">
                <AdminPerfil />
              </div>
            } />
            <Route path="*" element={
              <div className="container-admin-page-AP">
                <Dashboard />
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AdminPage;