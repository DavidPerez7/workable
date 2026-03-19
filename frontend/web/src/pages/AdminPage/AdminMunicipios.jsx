import React from 'react';
import CrudEntityPage from './CrudEntityPage/CrudEntityPage';
import municipioApi from '../../api/municipioAPI';

export default function AdminMunicipios() {
  return (
    <CrudEntityPage
      title="Municipios"
      subtitle="CRUD directo sobre el módulo /api/municipio."
      entityName="municipio"
      loadAll={municipioApi.getMunicipios}
      loadById={municipioApi.getMunicipioById}
      createItem={municipioApi.createMunicipio}
      updateItem={municipioApi.updateMunicipio}
      deleteItem={municipioApi.deleteMunicipio}
      samplePayload={{
        id: 1,
        nombre: '',
        departamento: 'BOGOTA_DC',
      }}
    />
  );
}