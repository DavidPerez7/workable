import React from 'react';
import CrudEntityPage from '../CrudEntityPage/CrudEntityPage';
import { adminAPI } from '../../../api/adminApi';

export default function AdminAdministradores() {
  return (
    <CrudEntityPage
      title="Administradores"
      subtitle="CRUD directo sobre el módulo /api/administrador de la API."
      entityName="administrador"
      loadAll={adminAPI.getAll}
      loadById={adminAPI.getById}
      createItem={adminAPI.create}
      updateItem={adminAPI.update}
      deleteItem={adminAPI.delete}
      samplePayload={{
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        rol: 'ADMIN',
      }}
    />
  );
}