import React from 'react';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import Sidebar from './Sidebar';
import CrudEntityPage from './CrudEntityPage/CrudEntityPage';
import { getAllOfertas, getOfertaById, crearOferta, actualizarOferta, eliminarOferta } from '../../api/ofertasAPI';
import './AdminPage.css';

export default function AdminOfertas() {
  return (
    <div className="admin-page-shell">
      <HeaderAdmin />
      <div className="admin-shell">
        <Sidebar />
        <div className="admin-content">
          <main className="admin-main">
            <CrudEntityPage
              title="Ofertas"
              subtitle="CRUD simplificado de ofertas con el estilo compartido del admin."
              entityName="oferta"
              showHeaderActions={false}
              loadAll={getAllOfertas}
              loadById={getOfertaById}
              createItem={crearOferta}
              updateItem={actualizarOferta}
              deleteItem={eliminarOferta}
              samplePayload={{
                titulo: '',
                descripcion: '',
                requisitos: '',
                empresa: { id: 1 },
                salario: 0,
                numeroVacantes: 1,
                modalidad: 'PRESENCIAL',
                nivelExperiencia: 'SIN_EXPERIENCIA',
                tipoContrato: 'TIEMPO_COMPLETO',
                fechaPublicacion: '2026-03-19',
                fechaLimite: '2026-04-18',
                estado: 'ABIERTA',
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}