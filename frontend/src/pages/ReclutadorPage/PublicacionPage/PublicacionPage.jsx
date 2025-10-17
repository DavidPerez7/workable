import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import './PublicacionPage.css';

const PublicacionPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tituloAviso: '',
    descripcionTrabajo: '',
    direccion: '',
    fechaPublicacion: '',
    fechaLimite: '',
    modalidadTrabajo: '',
    tipoContrato: '',
    empresa: '',
    municipio: ''
  });


  const modalidades = [
    { id: 1, nombre: 'Presencial' },
    { id: 2, nombre: 'Remoto' },
    { id: 3, nombre: 'Híbrido' }
  ];

  const tiposContrato = [
    { id: 1, nombre: 'Indefinido' },
    { id: 2, nombre: 'Término fijo' },
    { id: 3, nombre: 'Prácticas' }
  ];

  const empresas = [
    { id: 1, nombre: 'Empresa A' },
    { id: 2, nombre: 'Empresa B' },
    { id: 3, nombre: 'Empresa C' }
  ];

  const municipios = [
    { id: 1, nombre: 'Bogotá' },
    { id: 2, nombre: 'Medellín' },
    { id: 3, nombre: 'Cali' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datosListos = {
      NOMBRE: formData.tituloAviso,
      DESCRIPCION: formData.descripcionTrabajo,
      DIRECCION: formData.direccion,
      FECHA_PUBLI: formData.fechaPublicacion,
      FECHA_LIMIT: formData.fechaLimite,
      MODAL_ID: parseInt(formData.modalidadTrabajo),
      TIP_CONT_ID: parseInt(formData.tipoContrato),
      EMPRE_ID: parseInt(formData.empresa),
      MUNIC_ID: parseInt(formData.municipio)
    };

    console.log("Datos listos para guardar en la base de datos:", datosListos);
    alert("Formulario completado. Verifica la consola del navegador.");
  };

  return (
    <>
      <HeaderReclutador />
      <main className="container-main-PB">
        <h1 className="title-page-PB">Publicar oferta</h1>

        <form onSubmit={handleSubmit}>
          <section className="section-card-PB">
            <h2 className="title-section-PB">Datos de la oferta</h2>

            <label htmlFor="tituloAviso">
              Título del aviso:
              <input
                type="text"
                id="tituloAviso"
                name="tituloAviso"
                value={formData.tituloAviso}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="descripcionTrabajo">
              Descripción:
              <textarea
                id="descripcionTrabajo"
                name="descripcionTrabajo"
                value={formData.descripcionTrabajo}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>

            <label htmlFor="direccion">
              Dirección:
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="fechaPublicacion">
              Fecha de publicación:
              <input
                type="date"
                id="fechaPublicacion"
                name="fechaPublicacion"
                value={formData.fechaPublicacion}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="fechaLimite">
              Fecha límite:
              <input
                type="date"
                id="fechaLimite"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="modalidadTrabajo">
              Modalidad:
              <select
                id="modalidadTrabajo"
                name="modalidadTrabajo"
                value={formData.modalidadTrabajo}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una modalidad</option>
                {modalidades.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="tipoContrato">
              Tipo de contrato:
              <select
                id="tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo de contrato</option>
                {tiposContrato.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="empresa">
              Empresa:
              <select
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una empresa</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="municipio">
              Municipio:
              <select
                id="municipio"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un municipio</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </option>
                ))}
              </select>
            </label>

            <button className="button-submit-PB" type="submit">
              Publicar
            </button>
          </section>
        </form>
      </main>
    </>
  );
};

export default PublicacionPage;
