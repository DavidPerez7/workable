import React from 'react';
import CrudEntityPage from '../CrudEntityPage/CrudEntityPage';
import aspirantesApi from '../../../api/aspirantesApi';

export default function AdminUsuarios() {
  return (
    <CrudEntityPage
      title="Aspirantes"
      subtitle="CRUD simplificado para aspirantes con el estilo compartido del admin."
      entityName="aspirante"
      loadAll={aspirantesApi.getAll}
      loadById={null}
      createItem={aspirantesApi.create}
      updateItem={aspirantesApi.update}
      deleteItem={aspirantesApi.delete}
      samplePayload={{
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        fechaNacimiento: '1990-01-01',
        genero: 'MASCULINO',
        password: '',
        municipio: { id: 1 },
      }}
    />
  );
}