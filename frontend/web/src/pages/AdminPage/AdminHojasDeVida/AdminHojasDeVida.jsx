import React from 'react';
import CrudEntityPage from '../CrudEntityPage/CrudEntityPage';
import hojaDeVidaApi from '../../../api/hojaDeVidaAPI';

export default function AdminHojasDeVida() {
  return (
    <CrudEntityPage
      title="Hojas de vida"
      subtitle="CRUD directo sobre el módulo /api/hoja-vida. Usa JSON para la relación aspirante y las listas de estudios/experiencias."
      entityName="hoja de vida"
      loadAll={hojaDeVidaApi.getAllHojasDeVida}
      loadById={hojaDeVidaApi.getHojaDeVida}
      createItem={hojaDeVidaApi.crearHojaDeVida}
      updateItem={hojaDeVidaApi.actualizarHojaDeVida}
      deleteItem={hojaDeVidaApi.eliminarHojaDeVida}
      samplePayload={{
        resumenProfesional: '',
        redSocial: '',
        correoElectronico: '',
        telefono: '',
        aspirante: { id: 1 },
        estudios: [],
        experiencias: [],
      }}
    />
  );
}