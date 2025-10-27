// frontend/src/pages/ReclutadorPage/ReclutadorPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderReclutador from "../../components/HeaderReclutador/HeaderReclutador";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import "./ReclutadorPage.css";

function ReclutadorPage() {
  const [ofertas, setOfertas] = useState([]);
  const [postulacionesRecientes, setPostulacionesRecientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalOfertas: 12,
    totalPostulaciones: 45,
    contratados: 8,
    calificacionPromedio: 4.5
  });
  const [loading, setLoading] = useState(false); // Cambiado a false para mostrar datos mock
  const [empresaInfo, setEmpresaInfo] = useState({
    nombre: 'Cargando...',
    correoCorporativo: '',
    ubicacion: '',
    descripcion: '',
    numTrabajadores: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      let empresaId = localStorage.getItem('empresaId') || localStorage.getItem('empresa_id');
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      
      console.log('🔍 Token:', token ? 'Existe' : 'No existe');
      console.log('🔍 empresaId inicial:', empresaId);
      console.log('🔍 userId:', userId);
      console.log('🔍 role:', role);
      console.log('🔍 Todos los datos en localStorage:', {
        token: localStorage.getItem('token') ? 'Existe' : 'No',
        role: localStorage.getItem('role'),
        userId: localStorage.getItem('userId'),
        empresaId: localStorage.getItem('empresaId'),
        empresa_id: localStorage.getItem('empresa_id'),
        nombre: localStorage.getItem('nombre'),
        correo: localStorage.getItem('correo')
      });
      
      if (!token) {
        console.warn('⚠️ No hay token, pero continuamos con datos mock');
      }

      // Si no tenemos empresaId y somos reclutador, intentar obtenerlo del perfil del reclutador
      if (!empresaId && userId && role === 'RECLUTADOR') {
        try {
          console.log('🔄 Intentando obtener empresaId desde el perfil del reclutador...');
          const reclutadorResponse = await fetch(`http://localhost:8080/api/reclutadores/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (reclutadorResponse.ok) {
            const reclutadorData = await reclutadorResponse.json();
            console.log('📋 Datos del reclutador:', reclutadorData);
            
            // Intentar extraer empresaId de diferentes posibles campos
            const extractedEmpresaId = reclutadorData.empresaId || 
                                       reclutadorData.empresa_id || 
                                       (reclutadorData.empresa && reclutadorData.empresa.nitId) ||
                                       (reclutadorData.empresa && reclutadorData.empresa.nit_id);
            
            if (extractedEmpresaId) {
              empresaId = extractedEmpresaId;
              localStorage.setItem('empresaId', empresaId);
              localStorage.setItem('empresa_id', empresaId);
              console.log('✅ empresaId obtenido del perfil:', empresaId);
            } else {
              console.warn('⚠️ No se pudo extraer empresaId del perfil del reclutador');
            }
          }
        } catch (error) {
          console.error('❌ Error al obtener perfil del reclutador:', error);
        }
      }

      // Cargar información de la empresa
      if (empresaId) {
        try {
          console.log('🏢 Cargando datos de empresa con ID:', empresaId);
          const response = await fetch(`http://localhost:8080/api/empresa/${empresaId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('📡 Response status:', response.status);
          
          if (response.ok) {
            const empresaData = await response.json();
            console.log('✅ Datos de empresa cargados:', empresaData);
            
            // Mapear los nombres de campos del backend al frontend
            setEmpresaInfo({
              nombre: empresaData.nom || empresaData.nombre || 'Empresa',
              correoCorporativo: empresaData.correoCorp || empresaData.correoCorporativo || '',
              ubicacion: empresaData.ubi || empresaData.ubicacion || '',
              descripcion: empresaData.desc || empresaData.descripcion || '',
              numTrabajadores: empresaData.numTrab || empresaData.numTrabajadores || 0,
              nombreCategoria: empresaData.nomCat || empresaData.nombreCategoria || '',
              nombreMunicipio: empresaData.nomMunici || empresaData.nombreMunicipio || ''
            });
          } else {
            const errorText = await response.text();
            console.error('❌ Error al cargar empresa:', response.status, errorText);
            setEmpresaInfo({ nombre: 'Empresa', correoCorporativo: '', ubicacion: '', descripcion: '', numTrabajadores: 0 });
          }
        } catch (error) {
          console.error('❌ Error al obtener datos de empresa:', error);
          setEmpresaInfo({ nombre: 'Empresa', correoCorporativo: '', ubicacion: '', descripcion: '', numTrabajadores: 0 });
        }
      } else {
        console.error('❌ No se encontró empresaId en localStorage ni en el perfil del reclutador');
        setEmpresaInfo({ nombre: 'Empresa', correoCorporativo: '', ubicacion: '', descripcion: '', numTrabajadores: 0 });
      }

      // ========== DATOS MOCK (TEMPORALES) ==========
      // Comentar estas líneas y descomentar las APIs cuando el backend esté listo
      
      // Datos simulados de ofertas
      const mockOfertas = [
        {
          id: 1,
          titulo: 'Desarrollador Frontend',
          fecha_publicacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          municipio: 'Bogotá D.C',
          num_postulaciones: 12
        },
        {
          id: 2,
          titulo: 'Diseñador UX/UI',
          fecha_publicacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          municipio: 'Medellín',
          num_postulaciones: 8
        },
        {
          id: 3,
          titulo: 'Contador Senior',
          fecha_publicacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          municipio: 'Bogotá D.C',
          num_postulaciones: 5
        }
      ];

      // Datos simulados de postulaciones
      const mockPostulaciones = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@email.com',
          telefono: '3001234567',
          oferta_titulo: 'Desarrollador Frontend',
          fecha_postulacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'García',
          correo: 'maria.garcia@email.com',
          telefono: '3009876543',
          oferta_titulo: 'Diseñador UX/UI',
          fecha_postulacion: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          correo: 'carlos.rodriguez@email.com',
          telefono: '3012345678',
          oferta_titulo: 'Contador Senior',
          fecha_postulacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          nombre: 'Ana',
          apellido: 'Martínez',
          correo: 'ana.martinez@email.com',
          telefono: '3123456789',
          oferta_titulo: 'Desarrollador Frontend',
          fecha_postulacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setOfertas(mockOfertas);
      setPostulacionesRecientes(mockPostulaciones);
      setLoading(false);

      /* ========== DESCOMENTAR CUANDO EL BACKEND ESTÉ LISTO ==========
      
      try {
        // Obtener información de la empresa
        const resEmpresa = await fetch('http://localhost:5000/api/empresa/perfil', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (resEmpresa.ok) {
          const dataEmpresa = await resEmpresa.json();
          setEmpresaInfo(dataEmpresa);
        }

        // Obtener ofertas activas con número de postulaciones
        const resOfertas = await fetch('http://localhost:5000/api/ofertas/mis-ofertas-activas', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (resOfertas.ok) {
          const dataOfertas = await resOfertas.json();
          setOfertas(dataOfertas);
        }

        // Obtener postulaciones recientes (últimas 10)
        const resPostulaciones = await fetch('http://localhost:5000/api/postulaciones/recientes', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (resPostulaciones.ok) {
          const dataPostulaciones = await resPostulaciones.json();
          setPostulacionesRecientes(dataPostulaciones);
        }

        // Obtener estadísticas generales
        const resEstadisticas = await fetch('http://localhost:5000/api/empresa/estadisticas', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (resEstadisticas.ok) {
          const dataEstadisticas = await resEstadisticas.json();
          setEstadisticas(dataEstadisticas);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
        setLoading(false);
        // En caso de error, mantener datos mock
      }
      
      ========== FIN DE CÓDIGO COMENTADO ========== */
    };

    fetchDashboardData();
  }, [navigate]);

  const handleCerrarOferta = async (ofertaId) => {
    if (!window.confirm('¿Cerrar esta oferta? Los aspirantes no podrán postularse más.')) {
      return;
    }

    const token = localStorage.getItem('token');
    
    /* ========== API COMENTADA (DESCOMENTAR CUANDO BACKEND ESTÉ LISTO) ==========
    
    try {
      const response = await fetch(`http://localhost:5000/api/ofertas/${ofertaId}/cerrar`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('✅ Oferta cerrada exitosamente');
        setOfertas(ofertas.filter(o => o.id !== ofertaId));
      } else {
        alert('❌ Error al cerrar la oferta');
      }
    } catch (error) {
      console.error('Error al cerrar oferta:', error);
      alert('❌ Error al cerrar la oferta');
    }
    
    ========== FIN API COMENTADA ========== */

    // Simulación temporal (borrar cuando se active la API)
    alert('✅ Oferta cerrada exitosamente (simulado)');
    setOfertas(ofertas.filter(o => o.id !== ofertaId));
  };

  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaPost = new Date(fecha);
    const diferencia = Math.floor((ahora - fechaPost) / 1000); // segundos

    if (diferencia < 60) return 'Hace unos segundos';
    if (diferencia < 3600) return `Hace ${Math.floor(diferencia / 60)} minutos`;
    if (diferencia < 86400) return `Hace ${Math.floor(diferencia / 3600)} horas`;
    if (diferencia < 604800) return `Hace ${Math.floor(diferencia / 86400)} días`;
    return fechaPost.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <>
        <HeaderReclutador />
        <main className="dashboard-container">
          <div className="loading-dashboard">
            <div className="spinner"></div>
            <p>Cargando tu panel de control...</p>
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
      <main className="dashboard-container">
        
        {/* Header del Dashboard */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>👋 Bienvenido, <span className="empresa-nombre">{empresaInfo?.nombre || 'Empresa'}</span></h1>
            <p className="subtitle">Panel de Control - Gestiona tus ofertas y postulaciones</p>
          </div>
          <Link to="/reclutador/publicacion" className="btn-nueva-oferta">
            Nueva Oferta
          </Link>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3 className="stat-number">{estadisticas.totalOfertas}</h3>
              <p className="stat-label">Ofertas Activas</p>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-number">{estadisticas.totalPostulaciones}</h3>
              <p className="stat-label">Postulaciones</p>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-number">{estadisticas.contratados}</h3>
              <p className="stat-label">Contratados</p>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-number">{estadisticas.calificacionPromedio.toFixed(1)}</h3>
              <p className="stat-label">Calificación</p>
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>🏢 Información de la Empresa</h2>
          </div>
          <div className="empresa-info-card">
            <div className="empresa-info-grid">
              <div className="info-field">
                <span className="info-label">📝 Nombre:</span>
                <span className="info-value">{empresaInfo?.nombre || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="info-label">📧 Correo Corporativo:</span>
                <span className="info-value">{empresaInfo?.correoCorporativo || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="info-label">📍 Ubicación:</span>
                <span className="info-value">{empresaInfo?.ubicacion || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="info-label">🏙️ Municipio:</span>
                <span className="info-value">{empresaInfo?.nombreMunicipio || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="info-label">🏷️ Categoría:</span>
                <span className="info-value">{empresaInfo?.nombreCategoria || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="info-label">👥 Número de Trabajadores:</span>
                <span className="info-value">{empresaInfo?.numTrabajadores || 0}</span>
              </div>
              {empresaInfo?.descripcion && (
                <div className="info-field info-field-full">
                  <span className="info-label">📄 Descripción:</span>
                  <p className="info-value-description">{empresaInfo.descripcion}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sección: Mis Ofertas Activas */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>🔍 Mis Ofertas Activas</h2>
            <Link to="/reclutador/gestionar-ofertas" className="link-ver-todas">
              Ver todas →
            </Link>
          </div>

          {ofertas.length === 0 ? (
            <div className="empty-state">
              <p>No tienes ofertas activas. ¡Publica tu primera oferta!</p>
              <Link to="/reclutador/publicacion" className="btn-primary">
                Publicar Oferta
              </Link>
            </div>
          ) : (
            <div className="ofertas-list">
              {ofertas.map((oferta) => (
                <div key={oferta.id} className="oferta-card">
                  <div className="oferta-header">
                    <h3 className="oferta-titulo">📌 {oferta.titulo}</h3>
                    <span className="badge badge-activa">Activa</span>
                  </div>
                  
                  <div className="oferta-info">
                    <span className="info-item">
                      📅 Publicada: {formatearFecha(oferta.fecha_publicacion)}
                    </span>
                    <span className="info-item">
                      👥 <strong>{oferta.num_postulaciones || 0}</strong> postulaciones
                    </span>
                    <span className="info-item">
                      📍 {oferta.municipio}
                    </span>
                  </div>

                  <div className="oferta-actions">
                    <Link 
                      to={`/reclutador/postulaciones/${oferta.id}`}
                      className="btn-action btn-primary-action"
                      aria-label={`Ver postulaciones de ${oferta.titulo}`}
                    >
                      👁️ Ver Postulaciones
                    </Link>
                    <Link 
                      to={`/reclutador/editar-oferta/${oferta.id}`}
                      className="btn-action btn-secondary-action"
                      aria-label={`Editar oferta ${oferta.titulo}`}
                    >
                      ✏️ Editar
                    </Link>
                    <button 
                      onClick={() => handleCerrarOferta(oferta.id)}
                      className="btn-action btn-danger-action"
                      aria-label={`Cerrar oferta ${oferta.titulo}`}
                    >
                      🚫 Cerrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección: Postulaciones Recientes */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>👥 Postulaciones Recientes</h2>
            <Link to="/reclutador/gestionar-ofertas" className="link-ver-todas">
              Ver todas →
            </Link>
          </div>

          {postulacionesRecientes.length === 0 ? (
            <div className="empty-state">
              <p>No hay postulaciones recientes</p>
            </div>
          ) : (
            <div className="postulaciones-list">
              {postulacionesRecientes.map((postulacion) => (
                <div key={postulacion.id} className="postulacion-card">
                  <div className="aspirante-avatar">
                    {postulacion.nombre.charAt(0)}{postulacion.apellido.charAt(0)}
                  </div>
                  
                  <div className="postulacion-content">
                    <h4 className="aspirante-nombre">
                      {postulacion.nombre} {postulacion.apellido}
                    </h4>
                    <p className="postulacion-oferta">
                      Se postuló a: <strong>{postulacion.oferta_titulo}</strong>
                    </p>
                    <div className="postulacion-detalles">
                      <span>📧 {postulacion.correo}</span>
                      <span>📞 {postulacion.telefono}</span>
                      <span>🕒 {formatearFecha(postulacion.fecha_postulacion)}</span>
                    </div>
                  </div>

                  <div className="postulacion-actions">
                    <button 
                      className="btn-action-small btn-primary-small"
                      onClick={() => alert(`Ver perfil de ${postulacion.nombre} (funcionalidad pendiente)`)}
                      aria-label={`Ver perfil completo de ${postulacion.nombre}`}
                    >
                      Ver Perfil
                    </button>
                    <a 
                      href={`mailto:${postulacion.correo}`}
                      className="btn-action-small btn-success-small"
                      aria-label={`Contactar a ${postulacion.nombre} por correo`}
                    >
                      Contactar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gráficos y Estadísticas Adicionales */}
        <div className="stats-bottom-grid">
          <div className="chart-card">
            <h3>📊 Postulaciones por Oferta</h3>
            <div className="chart-placeholder">
              <p>Gráfico de barras (implementar con Chart.js)</p>
              <small>Muestra: Desarrollador Frontend (12), Diseñador UX/UI (8), Contador (5)</small>
            </div>
          </div>

          <div className="chart-card">
            <h3>📈 Tendencia Mensual</h3>
            <div className="chart-placeholder">
              <p>Gráfico de líneas (implementar con Chart.js)</p>
              <small>Evolución de postulaciones mes a mes</small>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}

export default ReclutadorPage;