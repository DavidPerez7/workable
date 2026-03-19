import React from 'react';
import CrudEntityPage from '../CrudEntityPage/CrudEntityPage';
import { getAllOfertas, getOfertaById, crearOferta, actualizarOferta, eliminarOferta } from '../../../api/ofertasAPI';

export default function AdminOfertas() {
  return (
    <CrudEntityPage
      title="Ofertas"
      subtitle="CRUD simplificado de ofertas con el estilo compartido del admin."
      entityName="oferta"
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
  );
}