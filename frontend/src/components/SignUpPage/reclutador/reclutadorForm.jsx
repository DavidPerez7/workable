import React, { useRef } from 'react';
import { crearReclutador } from '../../../api/reclutadoresApi';

const ReclutadorForm = ({ empresaId }) => {
  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.nom || !data.clave || !data.corr || !data.tel || !empresaId) {
      alert("❌ Todos los campos son obligatorios, incluyendo la empresa.");
      return;
    }

    const reclutadorData = {
      nom: data.nom,
      clave: data.clave,
      corr: data.corr,
      tel: Number(data.tel),
      empresa_id: Number(empresaId)
    };

    try {
      const respuesta = await crearReclutador(reclutadorData);
      console.log("✅ Reclutador creado:", respuesta);
      alert("Reclutador registrado con éxito");
      formRef.current.reset();
    } catch (error) {
      console.error("❌ Error al crear reclutador:", error);
      let mensajeError = "Error al registrar el reclutador";

      if (error.response) {
        mensajeError = error.response.data.message || mensajeError;
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor";
      } else if (error.message) {
        mensajeError = error.message;
      }

      alert(`❌ ${mensajeError}`);
    }
  };

  if (!empresaId) {
    return (
      <div className='form-reclutador-fields'>
        <p>No se ha encontrado la empresa asociada. Por favor, regrese y registre una empresa primero.</p>
      </div>
    );
  }

  return (
    <div className='form-reclutador-fields'>
      <form className='form-signup' onSubmit={handleSubmit} ref={formRef}>
        <input
          type='text'
          name='nom'
          placeholder='Nombre del reclutador'
          required
          className='input-signup'
        />
        <input
          type='email'
          name='corr'
          placeholder='Correo electrónico'
          required
          className='input-signup'
        />
        <input
          type='password'
          name='clave'
          placeholder='Contraseña'
          required
          className='input-signup'
        />
        <input
          type='tel'
          name='tel'
          placeholder='Teléfono'
          required
          className='input-signup'
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <input type="hidden" name="empresa_id" value={empresaId} />
        <button type='submit' className='button-submit'>
          Crear Cuenta Reclutador
        </button>
      </form>
    </div>
  );
};

export default ReclutadorForm;