import React from 'react';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './FeedBackPage.css';

function FeedbackManagementPage() {
  return (
    <>
      <HeaderAdmin />
      <main className="main-feedback-management-FMP">
        <div className="container-feedback-management-FMP">
          <h2 className="title-section-FMP">Gestión de Retroalimentación de Usuario</h2>
          <p>Revisa y responde a la retroalimentación de los usuarios, marcando como resuelta o importante.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default FeedbackManagementPage;