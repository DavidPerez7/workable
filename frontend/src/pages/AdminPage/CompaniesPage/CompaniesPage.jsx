import React from 'react';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './CompaniesPage.css';

function CompaniesManagementPage() {
  return (
    <>
      <HeaderAdmin />
      <main className="main-companies-management-CMP">
        <div className="container-companies-management-CMP">
          <h2 className="title-section-CMP">Gestión de Empresas</h2>
          <p>Aquí podrás ver el listado completo de empresas registradas, y gestionar sus perfiles.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CompaniesManagementPage;