package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Notificacion.Tipo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepo extends JpaRepository<Notificacion, Long> {
    
    // Búsquedas por Aspirante
    List<Notificacion> findByAspiranteId(Long aspiranteId);
    List<Notificacion> findByAspiranteIdAndLeida(Long aspiranteId, Boolean leida);
    List<Notificacion> findByAspiranteIdAndTipo(Long aspiranteId, Tipo tipo);
    List<Notificacion> findByAspiranteIdOrderByFechaCreacionDesc(Long aspiranteId);
    Long countByAspiranteIdAndLeida(Long aspiranteId, Boolean leida);
    
    // Búsquedas por Reclutador
    List<Notificacion> findByReclutadorId(Long reclutadorId);
    List<Notificacion> findByReclutadorIdAndLeida(Long reclutadorId, Boolean leida);
    List<Notificacion> findByReclutadorIdAndTipo(Long reclutadorId, Tipo tipo);
    List<Notificacion> findByReclutadorIdOrderByFechaCreacionDesc(Long reclutadorId);
    Long countByReclutadorIdAndLeida(Long reclutadorId, Boolean leida);
    
    // Búsqueda general
    Optional<Notificacion> findByTitulo(String titulo);
}
