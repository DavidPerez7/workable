import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import Footer from '../../../components/Footer/Footer';
import './ConfigPage.css';

const ConfigPage = () => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

  return (
    <>
      <HeaderReclutador />
      <main className='main-config-CFP'>
        <div className='container-module-CFP'>

          <section className='section-module-config-CFP'>
            <div className='header-module-config-CFP'>
              <h2 className='title-module-config-CFP'>Modificar e-mail y clave</h2>
              <Link to="/Reclutador/EditarPerfil" className='link-edit-config-CFP'>Editar</Link>
            </div>
            <div className='box-content-config-CFP'>
              <p className='text-content-config-CFP'>Estás registrado con el e-mail <span className='text-highlight-CFP'>ejemplo@gmail.com.</span> A esta dirección te enviaremos las notificaciones sobre nuevas ofertas y tus aplicaciones.</p>
            </div>
          </section>

          <section className='section-module-config-CFP'>
            <div className='header-module-config-CFP'>
              <h2 className='title-module-config-CFP'>Modificar nivel de privacidad</h2>
            </div>
            <div className='box-content-config-CFP'>
              <div className='privacy-options-CFP'>
                <div className='option-checkbox-CFP'>
                  <input type="checkbox" id="cvVisible" name="cvVisible"/>
                  <label htmlFor="cvVisible" className='label-checkbox-CFP'>Hoja de vida visible para las empresas</label>
                </div>
                <div className='option-checkbox-CFP'>
                  <input type="checkbox" id="cvNotVisible" name="cvNotVisible"/>
                  <label htmlFor="cvNotVisible" className='label-checkbox-CFP'>Hoja de vida no visible para las empresas
                  Las empresas no tienen acceso a tus datos y no pueden contactar contigo. Solamente las empresas a cuyos empleos aplicas, pueden visualizar tus datos y contactarte.</label>
                </div>
                <button className='button-action-config-CFP'>
                  <span>Modificar mi privacidad</span>
                </button>
              </div>
            </div>
          </section>

          <section className='section-module-config-CFP'>
            <div className='header-module-config-CFP'>
              <h2 className='title-module-config-CFP'>Eliminar cuenta</h2>
            </div>
            <div className='box-content-config-CFP'>
              <div className='delete-account-options-CFP'>
                <div className='option-checkbox-CFP'>
                  <input type="checkbox" id="deleteAccount" name="deleteAccount"/>
                  <label htmlFor="deleteAccount" className='label-checkbox-CFP'>Eliminar cuenta ejemplo@gmail.com.
                  Esta opción hace que tu cuenta ejemplo@gmail.com se elimine de manera definitiva junto con toda tu actividad en WORKABLE y todos los servicios contratados hasta la fecha.</label>
                </div>
                <button className='button-action-config-CFP'>
                  <span>Eliminar cuenta</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default ConfigPage;