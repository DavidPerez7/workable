import './aspiranteForm.css';
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
    <div className="aspirante-form-container">
      <form className="form-signup" onSubmit={handleSubmit} ref={formRef}>
        <h2 className="form-title">Registro de Aspirante</h2>
        <label>Nombre</label>
        <input
          type='text'
          name='nom'
          required
          className='input-signup'
          pattern="[A-Za-zÀ-ÿ\s]+"
          title="Solo se permiten letras y espacios"
        />
        <label>Apellido</label>
        <input
          type='text'
          name='ape'
          required
          className='input-signup'
          pattern="[A-Za-zÀ-ÿ\s]+"
          title="Solo se permiten letras y espacios"
        />
        <label>Correo electrónico</label>
        <input
          type='email'
          name='corr'
          required
          className='input-signup'
        />
        <label>Ubicación</label>
        <input
          type='text'
          name='ubi'
          required
          className='input-signup'
        />
        <label>Número de Teléfono</label>
        <input
          type='tel'
          name='tel'
          required
          className='input-signup'
        />
        <label>Fecha de Nacimiento</label>
        <input
          type='date'
          name='feNa'
          required
          className='input-signup'
        />
        <label>Contraseña</label>
        <input
          type='password'
          name='cla'
          required
          className='input-signup'
        />
        <label>Género</label>
        <select
          name='genero_id'
          required
          className='input-signup'
        >
          <option value=''>Selecciona tu género</option>
          <option value='1'>Masculino</option>
          <option value='2'>Femenino</option>
        </select>
        <label>Tipo de Documento</label>
        <select
          name='tipDoc_id'
          required
          className='input-signup'
        >
          <option value=''>Tipo de Documento</option>
          <option value='1'>CC</option>
          <option value='2'>TI</option>
        </select>
        <label>Número de Documento</label>
        <input
          type="number"
          name="numDoc"
          required
          className="input-signup"
          min="0"
          step="1"
        />
        <label>Ciudad</label>
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
