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
      await crearAspirante(data);
      alert("✅ Aspirante registrado con éxito");
      navigate('/Login'); 
    } catch (error) {
      console.error("Error al crear aspirante:", error.message);
      
      // Verificar si es un error de correo duplicado
      if (error.message.includes("Duplicate entry") || error.message.includes("correo")) {
        alert("❌ Error: Este correo electrónico ya está registrado. Por favor usa otro correo.");
      } else if (error.message.includes("numDoc") || error.message.includes("documento")) {
        alert("❌ Error: Este número de documento ya está registrado.");
      } else {
        alert("❌ Error al registrarse: " + error.message);
      }
    }
  };

  return (
    <div className="form-aspirante">
      <form className="form" onSubmit={handleSubmit} ref={formRef}>
        <div className='div_nombre'>
          <label>Nombre</label>
          <input
            type='text'
            name='nom'
            required
            className='input'
            pattern="[A-Za-zÀ-ÿ\s]+"
            title="Solo se permiten letras y espacios"
          />
        </div>
        <div className='div_apellido'>
          <label>Apellido</label>
          <input
            type='text'
            name='ape'
            required
            className='input'
            pattern="[A-Za-zÀ-ÿ\s]+"
            title="Solo se permiten letras y espacios"
          />
        </div>
        <div className='div_correo'>
          <label>Correo electrónico</label>
          <input
            type='email'
            name='corr'
            required
            className='input'
          />
        </div>
        <div className='div_ubicacion'>
          <label>Ubicación</label>
            <input
            type='text'
            name='ubi'
            required
            className='input'
          />
        </div>
        <div className='div_numero'>
          <label>Número de Teléfono</label>
          <input
            type='tel'
            name='tel'
            required
            className='input'
          />
        </div>
        <div className='div_fecha'>
          <label>Fecha de Nacimiento</label>
          <input
            type='date'
            name='feNa'
            required
            className='input'
          />
        </div>
        <div className='div_contraseña'>
          <label>Contraseña</label>
          <input
            type='password'
            name='cla'
            required
            className='input'
          />
        </div>
        <div className='div_genero'>
          <label>Género</label>
          <select
            name='genero_id'
            required
            className='input'
          >
            <option value=''>Selecciona tu género</option>
            <option value='1'>Masculino</option>
            <option value='2'>Femenino</option>
          </select>
        </div>
        <div className='div_tipoDoc'>
          <label>Tipo de Documento</label>
          <select
            name='tipDoc_id'
            required
            className='input'
          >
            <option value=''>Tipo de Documento</option>
            <option value='1'>CC</option>
            <option value='2'>TI</option>
          </select>
        </div> 
        <div className='div_numeroDoc'>
          <label>Número de Documento</label>
          <input
            type="number"
            name="numDoc"
            required
            className="input"
            min="0"
            step="1"
          />
        </div>
        <div className='div_ciudad'>
          <label>Ciudad</label>
          <select
            name='munici_id'
            required
            className='input'
          >
            <option value=''>Ciudad</option>
            <option value='1'>Cali</option>
            <option value='2'>Medellín</option>
            <option value='3'>Bogotá</option>
            <option value='4'>Barranquilla</option>
            <option value='5'>Cartagena</option>
          </select>
        </div>
        <button type='submit' className='btn'>
          Crear Cuenta Aspirante
        </button>
      </form>
    </div>
  );
};

export default AspiranteForm;
