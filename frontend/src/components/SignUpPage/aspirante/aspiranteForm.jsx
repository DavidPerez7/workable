import React, { useRef } from 'react';
import { crearAspirante } from '../../../api/aspirantesApi';
import { useNavigate } from 'react-router-dom';

const AspiranteForm = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    data.tel = Number(data.tel);
    data.tipDoc_id = Number(data.tipDoc_id);
    data.munici_id = Number(data.munici_id);
    data.genero_id = Number(data.genero_id);
    data.numDoc = Number(data.numDoc);

    if (
      isNaN(data.tel) ||
      isNaN(data.tipDoc_id) ||
      isNaN(data.munici_id) ||
      isNaN(data.genero_id) ||
      isNaN(data.numDoc) ||
      !data.nom ||
      !data.ape ||
      !data.corr ||
      !data.ubi ||
      !data.feNa ||
      !data.cla
    ) {
      alert("Error al registrarse: datos inválidos");
      return;
    }

    try {
      const aspiranteCreado = await crearAspirante(data);
      alert("Aspirante registrado con éxito");
      navigate('/Aspirante'); 
    } catch (error) {
      console.error("Error al crear aspirante:", error.message);
      alert("Error al registrarse: " + error.message);
    }
  };

  return (
    <div className='form-reclutador-fields'>
      <form className='form-signup' onSubmit={handleSubmit} ref={formRef}>
        <input
          type='text'
          name='nom'
          placeholder='Nombre'
          required
          className='input-signup'
          pattern="[A-Za-zÀ-ÿ\s]+"
          title="Solo se permiten letras y espacios"
        />
        <input
          type='text'
          name='ape'
          placeholder='Apellido'
          required
          className='input-signup'
          pattern="[A-Za-zÀ-ÿ\s]+"
          title="Solo se permiten letras y espacios"
        />
        <input
          type='email'
          name='corr'
          placeholder='Correo electrónico'
          required
          className='input-signup'
        />
        <input
          type='text'
          name='ubi'
          placeholder='Ubicación'
          required
          className='input-signup'
        />
        <input
          type='tel'
          name='tel'
          placeholder='Número de Teléfono'
          required
          className='input-signup'
        />
        <input
          type='date'
          name='feNa'
          placeholder='Fecha de Nacimiento'
          required
          className='input-signup'
        />
        <input
          type='password'
          name='cla'
          placeholder='Contraseña'
          required
          className='input-signup'
        />
        <select
          name='genero_id'
          required
          className='input-signup'
        >
          <option value=''>Selecciona tu género</option>
          <option value='1'>Masculino</option>
          <option value='2'>Femenino</option>
        </select>
        <select
          name='tipDoc_id'
          required
          className='input-signup'
        >
          <option value=''>Tipo de Documento</option>
          <option value='1'>CC</option>
          <option value='2'>TI</option>
        </select>
        <input
          type="number"
          name="numDoc"
          placeholder="Número de Documento"
          required
          className="input-signup"
          min="0"
          step="1"
        />
        <select
          name='munici_id'
          required
          className='input-signup'
        >
          <option value=''>Ciudad</option>
          <option value='1'>Cali</option>
          <option value='2'>Medellín</option>
          <option value='3'>Bogotá</option>
          <option value='4'>Barranquilla</option>
          <option value='5'>Cartagena</option>
        </select>
        <button type='submit' className='button-submit'>
          Crear Cuenta Aspirante
        </button>
      </form>
    </div>
  );
};

export default AspiranteForm;
