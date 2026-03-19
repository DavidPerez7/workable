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
import AdminAdministradores from './AdminAdministradores/AdminAdministradores';
import AdminReclutadores from './AdminReclutadores/AdminReclutadores';
import AdminMunicipios from './AdminMunicipios/AdminMunicipios';
import AdminHojasDeVida from './AdminHojasDeVida/AdminHojasDeVida';
import './CrudEntityPage/CrudEntityPage.css';
import './AdminPage.css';

function AdminPage() {
  return (
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
            <Route path="/Perfil" element={<AdminPerfil />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AdminPage;