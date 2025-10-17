import React from 'react';
import { Link } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import './ProfileEditPage.css';

function ProfileEditPage() {

  const handleEmailSubmit = (event) => {
    event.preventDefault();
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <HeaderReclutador />

      <main className='main-profile-edit-PEP'>
        <div className='nav-sub-edit-PEP'>
          <h1 className='title-nav-edit-PEP'>Modificar e-mail de acceso</h1>
          <h1 className='title-nav-edit-PEP'>Modificar clave</h1>
          <h1 className='title-nav-edit-PEP'>
            <Link to="/Reclutador/configuracion" className='link-return-PEP'>Volver a configuración</Link>
          </h1>
        </div>

        <div className='container-forms-edit-PEP'>
          <section className='form-email-edit-PEP'>
            <form onSubmit={handleEmailSubmit}>
              <div className='current-email-display-PEP'>
                <p className='label-email-PEP'>Email actual</p>
                <p className='value-email-PEP'>ejemplo@gmail.com</p>
              </div>
              <div className='input-group-edit-PEP'>
                <label htmlFor="newEmail" className='input-label-edit-PEP'>Nuevo e-mail</label>
                <input type="email" id="newEmail" name="newEmail" placeholder='' />
              </div>
              <div className='input-group-edit-PEP'>
                <label htmlFor="repeatNewEmail" className='input-label-edit-PEP'>Repetir e-mail</label>
                <input type="email" id="repeatNewEmail" name="repeatNewEmail" placeholder='' />
              </div>
              <button type="submit" className='button-action-edit-PEP'>
                Modificar mi e-mail
              </button>
            </form>
          </section>

          <section className='form-password-edit-PEP'>
            <form onSubmit={handlePasswordSubmit}>
              <div className='input-group-edit-PEP'>
                <label htmlFor="currentPassword" className='input-label-edit-PEP'>Clave actual</label>
                <input type="password" id="currentPassword" name="currentPassword" placeholder='' />
              </div>
              <div className='input-group-edit-PEP'>
                <label htmlFor="newPassword" className='input-label-edit-PEP'>Nueva clave</label>
                <input type="password" id="newPassword" name="newPassword" placeholder='' />
              </div>
              <div className='input-group-edit-PEP'>
                <label htmlFor="repeatNewPassword" className='input-label-edit-PEP'>Repetir clave</label>
                <input type="password" id="repeatNewPassword" name="repeatNewPassword" placeholder='' />
              </div>
              <button type="submit" className='button-action-edit-PEP'>
                Modificar mi clave
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default ProfileEditPage;