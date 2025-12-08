package com.workable_sb.workable.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Citacion;
import com.workable_sb.workable.models.Citacion.Estado;

@Repository
public interface CitacionRepo extends JpaRepository<Citacion, Long> {
    
    // Buscar citaciones por postulación
    List<Citacion> findByPostulacionId(Long postulacionId);
    
    // Buscar citaciones por reclutador
    List<Citacion> findByReclutadorId(Long reclutadorId);
    
    // Buscar citaciones por reclutador ordenadas por fecha
    List<Citacion> findByReclutadorIdOrderByFechaCitacionDesc(Long reclutadorId);
    
    // Buscar citaciones de una oferta (a través de la postulación)
    List<Citacion> findByPostulacionOfertaId(Long ofertaId);
    
    // Buscar citaciones por estado
    List<Citacion> findByEstado(Estado estado);
    
    // Buscar citaciones por reclutador y estado
    List<Citacion> findByReclutadorIdAndEstado(Long reclutadorId, Estado estado);
    
    // Buscar citaciones en una fecha específica
    List<Citacion> findByFechaCitacion(LocalDate fecha);
    
    // Buscar citaciones de un aspirante (a través de postulación)
    List<Citacion> findByPostulacionAspiranteId(Long aspiranteId);
    
    // Verificar si ya existe una citación para una postulación
    Optional<Citacion> findByPostulacionIdAndEstadoNot(Long postulacionId, Estado estado);
}
