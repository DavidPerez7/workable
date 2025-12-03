package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Notificacion.Tipo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepo extends JpaRepository<Notificacion, Long> {
    
    // Buscar notificaciones por usuario
    List<Notificacion> findByUsuarioId(Long usuarioId);

    //Buscar por titulo
    Optional <Notificacion> findByTitulo(String titulo);
    
    // Buscar notificaciones por usuario y estado de lectura
    List<Notificacion> findByUsuarioIdAndLeida(Long usuarioId, Boolean leida);
    
    // Buscar notificaciones por tipo
    List<Notificacion> findByUsuarioIdAndTipo(Long usuarioId, Tipo tipo);
    
    // Contar notificaciones no leídas
    Long countByUsuarioIdAndLeida(Long usuarioId, Boolean leida);
    
    // Buscar notificaciones activas
    List<Notificacion> findByUsuarioIdAndIsActive(Long usuarioId, Boolean isActive);
    
    // Ordenar por fecha descendente
    List<Notificacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
