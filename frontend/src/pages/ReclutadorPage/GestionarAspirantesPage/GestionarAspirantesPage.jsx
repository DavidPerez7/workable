// frontend/src/pages/ReclutadorPage/GestionarAspirantesPage/GestionarAspirantesPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderReclutador from '../../../components/HeaderReclutador/HeaderReclutador';
import Footer from '../../../components/Footer/Footer';
import NavBar from '../../../components/NavBar/NavBar';
import './GestionarAspirantesPage.css';

function GestionarAspirantesPage() {
  const [aspirantes, setAspirantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAspirantes, setFilteredAspirantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarAspirantes();
  }, []);

  useEffect(() => {
    // Filtrar aspirantes cuando cambia el término de búsqueda
    if (searchTerm.trim() === '') {
      setFilteredAspirantes(aspirantes);
    } else {
      const filtered = aspirantes.filter(aspirante =>
        aspirante.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aspirante.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aspirante.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aspirante.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAspirantes(filtered);
    }
  }, [searchTerm, aspirantes]);

  const cargarAspirantes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/aspirante', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Aspirantes cargados:', data);
        setAspirantes(data);
        setFilteredAspirantes(data);
      } else {
        console.error('❌ Error al cargar aspirantes:', response.status);
        alert('Error al cargar la lista de aspirantes');
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      alert('Error de conexión al cargar aspirantes');
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleVerPerfil = (aspiranteId) => {
    // Redirigir a una página de perfil detallado del aspirante
    navigate(`/reclutador/aspirante/${aspiranteId}`);
  };

  const handleContactar = (correo) => {
    window.location.href = `mailto:${correo}`;
  };

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <NavBar />
        <main className="gestionar-aspirantes-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando aspirantes...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderReclutador />
      <NavBar />
      <main className="gestionar-aspirantes-container">
        <div className="page-header">
          <div className="header-content">
            <h1>👥 Gestionar Aspirantes</h1>
            <p className="subtitle">Base de datos de todos los aspirantes registrados</p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, correo o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          <div className="results-count">
            <span>📊 Total: <strong>{filteredAspirantes.length}</strong> aspirante{filteredAspirantes.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Lista de aspirantes */}
        {filteredAspirantes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No se encontraron aspirantes</h3>
            <p>
              {searchTerm
                ? 'No hay aspirantes que coincidan con tu búsqueda'
                : 'Aún no hay aspirantes registrados en la plataforma'}
            </p>
          </div>
        ) : (
          <div className="aspirantes-table-container">
            <table className="aspirantes-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Ubicación</th>
                  <th>Edad</th>
                  <th>Género</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAspirantes.map((aspirante) => (
                  <tr key={aspirante.aspiranteId}>
                    <td className="nombre-cell">
                      <div className="aspirante-avatar">
                        {aspirante.nombre?.charAt(0) || 'A'}{aspirante.apellido?.charAt(0) || ''}
                      </div>
                      <div className="nombre-info">
                        <strong>{aspirante.nombre} {aspirante.apellido}</strong>
                        <small>ID: {aspirante.aspiranteId}</small>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${aspirante.correo}`} className="correo-link">
                        📧 {aspirante.correo}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${aspirante.telefono}`} className="telefono-link">
                        📞 {aspirante.telefono}
                      </a>
                    </td>
                    <td>
                      <span className="ubicacion-badge">
                        📍 {aspirante.ubicacion || 'No especificado'}
                      </span>
                    </td>
                    <td>{calcularEdad(aspirante.fechaNacimiento)} años</td>
                    <td>
                      <span className="genero-badge">
                        {aspirante.genero === 'Masculino' ? '👨' : aspirante.genero === 'Femenino' ? '👩' : '🧑'} 
                        {aspirante.generoNombre || aspirante.genero || 'N/A'}
                      </span>
                    </td>
                    <td>{formatearFecha(aspirante.fechaRegistro)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleVerPerfil(aspirante.aspiranteId)}
                          className="btn-action btn-ver"
                          title="Ver perfil completo"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleContactar(aspirante.correo)}
                          className="btn-action btn-contactar"
                          title="Enviar correo"
                        >
                          ✉️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default GestionarAspirantesPage;
