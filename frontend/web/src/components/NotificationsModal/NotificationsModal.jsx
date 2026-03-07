import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import './NotificationsModal.css';

const NotificationsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones al montar
  useEffect(() => {
    if (isOpen) {
      cargarNotificaciones();
    }
  }, [isOpen]);

  const cargarNotificaciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/notificacion/aspirante', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al cargar notificaciones');

      const data = await response.json();
      setNotifications(data || []);
      
      // Contar no leídas
      const noLeidas = data.filter(n => !n.leida).length;
      setUnreadCount(noLeidas);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/notificacion/${id}/marcar-leida`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      cargarNotificaciones();
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const obtenerTipoColor = (tipo) => {
    switch (tipo) {
      case 'POSTULACION':
        return '#3b82f6';
      case 'ENTREVISTA':
        return '#10b981';
      case 'CAMBIO_ESTADO':
        return '#f59e0b';
      case 'MENSAJE':
        return '#8b5cf6';
      default:
        return '#64748b';
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (date.toDateString() === hoy.toDateString()) {
      return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-CO');
    }
  };

  return (
    <div className="notifications-container">
      {/* Botón de campana */}
      <button
        className="notifications-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Notificaciones"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Modal de notificaciones */}
      {isOpen && (
        <div className="notifications-modal">
          <div className="notifications-header">
            <h3>Notificaciones</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={48} />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${!notif.leida ? 'unread' : ''}`}
                  onClick={() => !notif.leida && marcarComoLeida(notif.id)}
                >
                  <div
                    className="notification-indicator"
                    style={{ backgroundColor: obtenerTipoColor(notif.tipo) }}
                  />
                  <div className="notification-content">
                    <h4>{notif.titulo}</h4>
                    <p>{notif.mensaje}</p>
                    <span className="notification-time">{formatearFecha(notif.fechaCreacion)}</span>
                  </div>
                  {!notif.leida && <div className="unread-dot" />}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notifications-footer">
              <small>Las notificaciones antiguas se eliminan automáticamente</small>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar modal */}
      {isOpen && (
        <div
          className="notifications-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationsModal;
