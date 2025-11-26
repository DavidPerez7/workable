package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Notificacion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepo extends JpaRepository<Notificacion, Integer> {
    
    List<Notificacion> findByUsuarioId(Integer usuarioId);
    List<Notificacion> findByUsuarioAndLeida(Integer usuarioId, Boolean leida);
    List<Notificacion> findByTipo(String tipo);
    Long countByUsuarioAndLeida(Integer usuarioId, Boolean leida);
    List<Notificacion> findByUsuarioAndFecha(Integer usuarioId);
}
