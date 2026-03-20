import React from 'react';
import CrudEntityPage from './CrudEntityPage/CrudEntityPage';
import { postulacionAPI as adminPostulacionAPI } from '../../api/adminApi';
import { obtenerPostulacionPorId, crearPostulacion, actualizarPostulacion, eliminarPostulacion } from '../../api/postulacionesAPI';

export default function AdminPostulaciones() {
  return (
    <CrudEntityPage
      title="Postulaciones"
      subtitle="CRUD simplificado para postulaciones con el estilo compartido del admin."
      entityName="postulación"
      showHeaderActions={false}
      loadAll={adminPostulacionAPI.getAll}
      loadById={obtenerPostulacionPorId}
      createItem={crearPostulacion}
      updateItem={(id, payload) => actualizarPostulacion({ id, ...payload })}
      deleteItem={eliminarPostulacion}
      samplePayload={{
        aspirante: { id: 1 },
        oferta: { id: 1 },
        estado: 'PENDIENTE',
      }}
    />
  );
}