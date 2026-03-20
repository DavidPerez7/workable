import React from 'react';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import Sidebar from './Sidebar';
import CrudEntityPage from './CrudEntityPage/CrudEntityPage';
import { getAllEmpresasDto, getEmpresaById, crearEmpresa, actualizarEmpresa, eliminarEmpresa } from '../../api/empresaAPI';
import './AdminPage.css';

export default function AdminEmpresas() {
  return (
    <div className="admin-page-shell">
      <HeaderAdmin />
      <div className="admin-shell">
        <Sidebar />
        <div className="admin-content">
          <main className="admin-main">
            <CrudEntityPage
              title="Empresas"
              subtitle="CRUD simplificado para empresas con el estilo compartido del admin."
              entityName="empresa"
              showHeaderActions={false}
              loadAll={getAllEmpresasDto}
              loadById={getEmpresaById}
              createItem={crearEmpresa}
              updateItem={actualizarEmpresa}
              deleteItem={eliminarEmpresa}
              samplePayload={{
                nombre: '',
                descripcion: '',
                nit: '',
                emailContacto: '',
                telefonoContacto: '',
                numeroTrabajadores: 1,
                website: '',
                logoUrl: '',
                razonSocial: '',
                municipio: { id: 1 },
                categories: [],
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}