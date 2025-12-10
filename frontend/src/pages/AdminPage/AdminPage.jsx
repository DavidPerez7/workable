import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from '../../components/Footer/footer';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import CompaniesPage from './CompaniesPage/CompaniesPage';
import OffersPage from './OffersPage/OffersPage';
import ProductManagement from './ProductManagement';
import RolesManagement from './RolesManagement';
import LogsPage from './LogsPage';
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
              <Route path="/Usuarios" element={<UserManagement />} />
              <Route path="/Empresas" element={<CompaniesPage />} />
              <Route path="/Ofertas" element={<OffersPage />} />
              <Route path="/Productos" element={<ProductManagement />} />
              <Route path="/Roles" element={<RolesManagement />} />
              <Route path="/Logs" element={<LogsPage />} />
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