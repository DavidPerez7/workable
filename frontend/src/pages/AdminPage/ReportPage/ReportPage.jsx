import React from 'react';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './ReportPage.css';

function ReportManagementPage() {
  return (
    <>
      <HeaderAdmin />
      <main className="main-report-management-RMP">
        <div className="container-report-management-RMP">
          <h2 className="title-section-RMP">Gestión de Reportes del Sistema</h2>
          <p>Revisa y gestiona los reportes sobre ofertas, usuarios y empresas.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ReportManagementPage;