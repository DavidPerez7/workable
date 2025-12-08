package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Notificacion.Tipo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepo extends JpaRepository<Notificacion, Long> {
    
    // Buscar notificaciones por aspirante
    List<Notificacion> findByAspiranteId(Long aspiranteId);

    //Buscar por titulo
    Optional <Notificacion> findByTitulo(String titulo);
    
    // Buscar notificaciones por aspirante y estado de lectura
    List<Notificacion> findByAspiranteIdAndLeida(Long aspiranteId, Boolean leida);
    
    // Buscar notificaciones por tipo
    List<Notificacion> findByAspiranteIdAndTipo(Long aspiranteId, Tipo tipo);
    
    // Contar notificaciones no leídas
    Long countByAspiranteIdAndLeida(Long aspiranteId, Boolean leida);
    
    // Ordenar por fecha descendente
    List<Notificacion> findByAspiranteIdOrderByFechaCreacionDesc(Long aspiranteId);
}
