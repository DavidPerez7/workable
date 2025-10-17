import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { crearEmpresa } from "../../../api/empresaAPI";

const EmpresaForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (
      !data.nit_id ||
      !data.nom ||
      !data.ubi ||
      !data.desc ||
      !data.numTrab ||
      !data.correoCorp ||
      !data.cat_id ||
      !data.munici_id
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const empresaData = {
      nit_id: Number(data.nit_id),
      nom: data.nom,
      ubi: data.ubi,
      desc: data.desc,
      numTrab: Number(data.numTrab),
      correoCorp: data.correoCorp,
      cat_id: Number(data.cat_id),
      munici_id: Number(data.munici_id),
    };

    try {
      const respuesta = await crearEmpresa(empresaData);
      alert("Empresa registrada con éxito");
      formRef.current.reset();

      navigate("/Reclutador");
    } catch (error) {
      console.error("Error al crear empresa:", error);
      let mensajeError = "Error al registrar la empresa";

      if (error.response) {
        mensajeError = error.response.data.message || mensajeError;
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor";
      } else if (error.message) {
        mensajeError = error.message;
      }

      alert(`${mensajeError}`);
    }
  };

  return (
    <div className="form-reclutador-fields">
      <form className="form-signup" onSubmit={handleSubmit} ref={formRef}>
        <input
          type="text"
          name="nom"
          placeholder="Nombre de la empresa"
          required
          className="input-signup"
        />
        <input
          type="text"
          name="ubi"
          placeholder="Ubicación (dirección)"
          required
          className="input-signup"
        />
        <textarea
          name="desc"
          placeholder="Descripción de la empresa"
          required
          className="input-signup"
          rows="3"
        />
        <input
          type="number"
          name="numTrab"
          placeholder="Número de trabajadores"
          required
          className="input-signup"
          min="1"
        />
        <input
          type="email"
          name="correoCorp"
          placeholder="Correo corporativo"
          required
          className="input-signup"
        />
        <input
          type="text"
          name="nit_id"
          placeholder="NIT de la empresa"
          required
          className="input-signup"
        />
        <select name="cat_id" required className="input-signup">
          <option value="">Selecciona categoría</option>
          <option value="1">Tecnología</option>
          <option value="2">Salud</option>
          <option value="3">Educación</option>
          <option value="4">Finanzas</option>
          <option value="5">Otros</option>
        </select>
        <select name="munici_id" required className="input-signup">
          <option value="">Selecciona municipio</option>
          <option value="1">Cali</option>
          <option value="2">Medellín</option>
          <option value="3">Bogotá</option>
          <option value="4">Barranquilla</option>
          <option value="5">Cartagena</option>
        </select>
        <button type="submit" className="button-submit">
          Continuar con registro de empresa
        </button>
      </form>
    </div>
  );
};

export default EmpresaForm;
