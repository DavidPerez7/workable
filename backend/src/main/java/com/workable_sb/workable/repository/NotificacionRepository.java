package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Notificacion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    
    // Buscar notificaciones por usuario
    List<Notificacion> findByUsuarioId(Integer usuarioId);
    
    // Buscar notificaciones no leídas por usuario
    List<Notificacion> findByUsuarioIdAndLeidaFalse(Integer usuarioId);
    
    // Buscar notificaciones por tipo
    List<Notificacion> findByTipo(String tipo);
    
    // Contar notificaciones no leídas
    Long countByUsuarioIdAndLeidaFalse(Integer usuarioId);
    
    // Buscar notificaciones por usuario ordenadas por fecha descendente
    List<Notificacion> findByUsuarioIdOrderByFechaDesc(Integer usuarioId);
}
