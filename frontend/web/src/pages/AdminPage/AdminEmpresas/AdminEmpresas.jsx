import React from 'react';
import CrudEntityPage from '../CrudEntityPage/CrudEntityPage';
import { getAllEmpresasDto, getEmpresaById, crearEmpresa, actualizarEmpresa, eliminarEmpresa } from '../../../api/empresaAPI';

export default function AdminEmpresas() {
  return (
    <CrudEntityPage
      title="Empresas"
      subtitle="CRUD simplificado para empresas con el estilo compartido del admin."
      entityName="empresa"
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
  );
}