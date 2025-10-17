import React, { useEffect, useState } from 'react';
import { getAdministradores, eliminarAdministrador } from '../../../api/administradorAPI';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './AdminAccountPage.css';

function AdminAccountsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdministradores()
      .then(setAdmins)
      .catch(() => setError('Error al cargar administradores'))
      .finally(() => setLoading(false));
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este administrador?')) return;
    try {
      await eliminarAdministrador(id);
      setAdmins(admins.filter(a => a.administradorId !== id));
    } catch (err) {
      alert('No se pudo eliminar el administrador');
    }
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-admin-accounts-AAP">
        <div className="container-admin-accounts-AAP">
          <h2 className="title-section-AAP">Administrar Cuentas Internas</h2>
          <p>Aquí podrás crear, modificar y eliminar cuentas de administradores de la plataforma.</p>
          {loading ? <p>Cargando...</p> : error ? <p>{error}</p> : (
            <table className="admins-table-AAP">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.administradorId}>
                    <td>{admin.administradorId}</td>
                    <td>{admin.nombre}</td>
                    <td>{admin.correo}</td>
                    <td>{admin.rol}</td>
                    <td>
                      <button onClick={() => handleEliminar(admin.administradorId)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminAccountsPage;