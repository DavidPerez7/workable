import React from 'react';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './OffersPage.css';

function OffersManagementPage() {
  return (
    <>
      <HeaderAdmin />
      <main className="main-offers-management-OMP">
        <div className="container-offers-management-OMP">
          <h2 className="title-section-OMP">Gestión de Ofertas Laborales</h2>
          <p>Aquí podrás ver el listado completo de ofertas publicadas y gestionar su estado o eliminarlas.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OffersManagementPage;