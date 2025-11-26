import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar} from "react-icons/fa";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../../components/Footer/Footer";
import "./EmpresaPage.css";

function EmpresaPage() {
  return (
    <>
      <HeaderReclutador />
      <main className="enterprise-main">
        <div className="banner-enterprise">
            <div className="image-enterprise">
                <img src="data:image/png;base64,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" alt="" />
            </div>
        </div>
        <section className="profile-enterprise">
            <div className="enterprise-header">
                <div className="enterprise-logo">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmKkiZmRvFeO0l5V4IWLmZ40AqLX_2sq4tihYLoy4NwpJ3ExHbBygTB4vtZgBua7qKFDQ&usqp=CAU" alt="" />
                </div>
                <div className="title-enterprise">
                    <div>
                        <h1>The Coca-Cola Company</h1>
                        <p>Alimentacion y bebidas</p>
                        <p>Ubicacion</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default EmpresaPage;