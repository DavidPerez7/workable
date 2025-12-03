import React, { useState } from "react";
import HeaderReclutador from "../../../components/HeaderReclutador/HeaderReclutador";
import "./PublicacionPage.css";

const PublicacionPage = () => {
  const [formData, setFormData] = useState({
    tituloAviso: "",
    descripcionTrabajo: "",
    salario: "",
    direccion: "",
    fechaPublicacion: "",
    fechaLimite: "",
    modalidadTrabajo: "",
    tipoContrato: "",
    municipio: "",
  });

  const modalidades = [
    { id: 1, nombre: "Presencial" },
    { id: 2, nombre: "Remoto" },
    { id: 3, nombre: "Híbrido" },
  ];

  const tiposContrato = [
    { id: 1, nombre: "Indefinido" },
    { id: 2, nombre: "Término fijo" },
    { id: 3, nombre: "Prácticas" },
  ];

  const municipios = [
    { id: 1, nombre: "Bogotá" },
    { id: 2, nombre: "Medellín" },
    { id: 3, nombre: "Cali" },
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
      SALARIO: formData.salario,
      DIRECCION: formData.direccion,
      FECHA_PUBLI: formData.fechaPublicacion,
      FECHA_LIMIT: formData.fechaLimite,
      MODAL_ID: parseInt(formData.modalidadTrabajo),
      TIP_CONT_ID: parseInt(formData.tipoContrato),
      MUNIC_ID: parseInt(formData.municipio),
    };

    console.log("Datos listos para guardar:", datosListos);
    alert("Oferta preparada para guardar (ver consola).");
  };

  return (
    <>
      <HeaderReclutador />

      <main className="pb-container">
        <h1 className="pb-title">Publicar oferta</h1>

        <form className="pb-form" onSubmit={handleSubmit}>
          <section className="pb-card">

            <h2 className="pb-section-title">Datos de la oferta</h2>

            <div className="pb-field">
              <label htmlFor="tituloAviso">Título del aviso *</label>
              <input
                type="text"
                id="tituloAviso"
                name="tituloAviso"
                value={formData.tituloAviso}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="descripcionTrabajo">Descripción *</label>
              <textarea
                id="descripcionTrabajo"
                name="descripcionTrabajo"
                value={formData.descripcionTrabajo}
                onChange={handleChange}
                rows="4"
                required
                className="pb-textarea"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="salario">Salario *</label>
              <input
                type="number"
                id="salario"
                name="salario"
                value={formData.salario}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="fechaPublicacion">Fecha de publicación *</label>
              <input
                type="date"
                id="fechaPublicacion"
                name="fechaPublicacion"
                value={formData.fechaPublicacion}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="fechaLimite">Fecha límite *</label>
              <input
                type="date"
                id="fechaLimite"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="modalidadTrabajo">Modalidad *</label>
              <select
                id="modalidadTrabajo"
                name="modalidadTrabajo"
                value={formData.modalidadTrabajo}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona una modalidad</option>
                {modalidades.map((mod) => (
                  <option key={mod.id} value={mod.id}>{mod.nombre}</option>
                ))}
              </select>
            </div>

            <div className="pb-field">
              <label htmlFor="tipoContrato">Tipo de contrato *</label>
              <select
                id="tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona un tipo de contrato</option>
                {tiposContrato.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>

            <div className="pb-field">
              <label htmlFor="municipio">Municipio *</label>
              <select
                id="municipio"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona un municipio</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>{mun.nombre}</option>
                ))}
              </select>
            </div>

            <button className="pb-btn-primary" type="submit">
              Publicar
            </button>
          </section>
        </form>
      </main>
    </>
  );
};

export default PublicacionPage;
