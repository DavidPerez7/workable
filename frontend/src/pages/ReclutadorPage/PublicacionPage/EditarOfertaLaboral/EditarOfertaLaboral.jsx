import React, { useEffect, useState } from "react";
import HeaderReclutador from "../../../../components/HeaderReclutador/HeaderReclutador";
import "./EditarOfertaLaboral.css";

const EditarOfertaLaboral = () => {
  const [formData, setFormData] = useState({
    id: "",
    tituloAviso: "",
    descripcionTrabajo: "",
    salario: "",
    direccion: "",
    fechaPublicacion: "",
    fechaLimite: "",
    modalidadTrabajo: "",
    tipoContrato: "",
    municipio: "",
    nitEmpresa: "", // NO editable (RF08)
  });

  const [cargando, setCargando] = useState(true);

  // Datos estáticos de prueba (deberás reemplazar con fetch real)
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

  // ⚡ RF08 — Cargar datos actuales de la oferta
  useEffect(() => {
    // Simulación de carga (deberás reemplazar con API GET oferta/:id)
    setTimeout(() => {
      setFormData({
        id: "25",
        tituloAviso: "Desarrollador Frontend React",
        descripcionTrabajo: "Mantenimiento y desarrollo de nuevas funcionalidades.",
        salario: "3500000",
        direccion: "Calle 45 # 12 - 22",
        fechaPublicacion: "2025-02-01",
        fechaLimite: "2025-02-20",
        modalidadTrabajo: "2",
        tipoContrato: "1",
        municipio: "1",
        nitEmpresa: "901457890", // NO editable
      });
      setCargando(false);
    }, 600);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ⚡ RF08 — Actualizar oferta
  const handleSubmit = (e) => {
    e.preventDefault();

    const datosListos = {
      ID: formData.id,
      TITULO: formData.tituloAviso,
      DESCRIPCION: formData.descripcionTrabajo,
      SALARIO: formData.salario,
      DIRECCION: formData.direccion,
      FECHA_PUBLI: formData.fechaPublicacion,
      FECHA_LIMIT: formData.fechaLimite,
      MODAL_ID: parseInt(formData.modalidadTrabajo),
      CONTRATO_ID: parseInt(formData.tipoContrato),
      MUNIC_ID: parseInt(formData.municipio),
      NIT_EMPRESA: formData.nitEmpresa,
    };

    console.log("Datos actualizados:", datosListos);
    alert("Oferta actualizada exitosamente ✔");
  };

  if (cargando) {
    return (
        <>
          <HeaderReclutador />
          <main className="pb-container">
            <p className="pb-loading">Cargando datos...</p>
          </main>
        </>
    );
  }

  return (
    <>
      <HeaderReclutador />

      <main className="pb-container">
        <h1 className="pb-title">Editar oferta laboral</h1>

        <form className="pb-form" onSubmit={handleSubmit}>
          <section className="pb-card">

            <h2 className="pb-section-title">Información de la oferta</h2>

            <div className="pb-field">
              <label>NIT de la empresa (No editable)</label>
              <input
                type="text"
                disabled
                className="pb-input pb-disabled"
                value={formData.nitEmpresa}
              />
            </div>

            <div className="pb-field">
              <label htmlFor="tituloAviso">Título *</label>
              <input
                id="tituloAviso"
                name="tituloAviso"
                type="text"
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
                rows="4"
                value={formData.descripcionTrabajo}
                onChange={handleChange}
                required
                className="pb-textarea"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="salario">Salario *</label>
              <input
                id="salario"
                name="salario"
                type="number"
                value={formData.salario}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="direccion">Dirección *</label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="fechaPublicacion">Fecha de publicación *</label>
              <input
                id="fechaPublicacion"
                name="fechaPublicacion"
                type="date"
                value={formData.fechaPublicacion}
                onChange={handleChange}
                required
                className="pb-input"
              />
            </div>

            <div className="pb-field">
              <label htmlFor="fechaLimite">Fecha límite *</label>
              <input
                id="fechaLimite"
                name="fechaLimite"
                type="date"
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
                <option value="">Selecciona...</option>
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
                <option value="">Selecciona...</option>
                {tiposContrato.map((tc) => (
                  <option key={tc.id} value={tc.id}>{tc.nombre}</option>
                ))}
              </select>
            </div>

            <div classNAME="pb-field">
              <label htmlFor="municipio">Municipio *</label>
              <select
                id="municipio"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                required
                className="pb-select"
              >
                <option value="">Selecciona...</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>{mun.nombre}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="pb-btn-primary">
              Guardar cambios
            </button>

          </section>
        </form>
      </main>
    </>
  );
};

export default EditarOfertaLaboral;
