import React from 'react';
import CrudEntityPage from './CrudEntityPage/CrudEntityPage';
import reclutadoresApi from '../../api/reclutadoresApi';

export default function AdminReclutadores() {
  return (
    <CrudEntityPage
      title="Reclutadores"
      subtitle="CRUD directo sobre el módulo /api/reclutador. Usa JSON para relaciones como municipio y empresa."
      entityName="reclutador"
      showHeaderActions={false}
      loadAll={reclutadoresApi.getAll}
      loadById={reclutadoresApi.get}
      createItem={reclutadoresApi.create}
      updateItem={(id, payload) => reclutadoresApi.updateAdmin(id, payload)}
      deleteItem={reclutadoresApi.delete}
      samplePayload={{
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        fechaNacimiento: '1990-01-01',
        password: '',
        rol: 'RECLUTADOR',
        municipio: { id: 1 },
        empresa: { id: 1 },
      }}
    />
  );
}