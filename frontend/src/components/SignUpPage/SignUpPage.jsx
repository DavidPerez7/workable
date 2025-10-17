import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './SignUpPage.css';
import EmpresaForm from './empresa/empresaForm';
import AspiranteForm from './aspirante/aspiranteForm';

const SignUpPage = () => {
  const [userType, setUserType] = useState('aspirante');

  return (
    <>
      <Header />
      <main className='main-signup'>
        <div className='div-signup-container'>
          <h2 className='h2-signup-title'>Regístrate en workable</h2>
          <p className='p-signup-instruction'>Crea una cuenta para comenzar</p>
          <div className='signup-buttons'>
            <button
              className={`Btn-signup ${userType === 'aspirante' ? 'active' : ''}`}
              onClick={() => setUserType('aspirante')}
            >
              Soy Aspirante
            </button>
            <button
              className={`Btn-signup ${userType === 'empresa' ? 'active' : ''}`}
              onClick={() => setUserType('empresa')}
            >
              Soy Empresa
            </button>
          </div>
          {userType === 'aspirante' ? <AspiranteForm /> : <EmpresaForm />}
          <p className='text-link'>
            Ya tienes una cuenta? <Link to='/Login'>Iniciar Sesión</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignUpPage;