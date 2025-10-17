import React, { useEffect, useState } from 'react';
import { getUsuarios, eliminarUsuario } from '../../../api/usuarioAPI';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer/Footer';
import './UsersManagePage.css';

function UsersManagementPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar usuarios');
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await eliminarUsuario(id);
      setUsuarios(usuarios.filter(u => u.usuarioId !== id));
    } catch (err) {
      alert('No se pudo eliminar el usuario');
    }
  };

  return (
    <>
      <HeaderAdmin />
      <main className="main-users-management-UMP">
        <div className="container-users-management-UMP">
          <h2 className="title-section-UMP">Gestión de Usuarios</h2>
          <p>Aquí podrás ver el listado completo de usuarios y gestionar sus perfiles o suspenderlos.</p>
          {loading ? <p>Cargando...</p> : error ? <p>{error}</p> : (
            <table className="usuarios-table-UMP">
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
                {usuarios.map(usuario => (
                  <tr key={usuario.usuarioId}>
                    <td>{usuario.usuarioId}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <button onClick={() => handleEliminar(usuario.usuarioId)}>Eliminar</button>
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

export default UsersManagementPage;