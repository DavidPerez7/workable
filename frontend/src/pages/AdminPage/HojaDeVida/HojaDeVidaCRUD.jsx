import React from 'react';
import Sidebar from '../Sidebar';
import './HojaDeVidaCRUD.css';

export default function HojaDeVidaCRUD() {
  // Aquí irá la lógica CRUD de hojas de vida
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-users-manage-UP">
        <div className="container-users-manage-UP">
          <h1 className="title-users-UP">Gestión de Hojas de Vida</h1>
          <p className="subtitle-users-UP">Administra las hojas de vida de los usuarios</p>
          {/* Aquí irá la tabla y el CRUD */}
        </div>
      </div>
    </div>
  );
}
