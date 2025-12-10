package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;

@Repository
public interface PostulacionRepo extends JpaRepository<Postulacion, Long> {
    
    // Buscar postulaciones por oferta
    List<Postulacion> findByOfertaId(Long ofertaId);
    
    // Buscar postulaciones por aspirante
    List<Postulacion> findByAspiranteId(Long aspiranteId);
    
    // Buscar postulaciones por oferta y estado
    List<Postulacion> findByOfertaIdAndEstado(Long ofertaId, Estado estado);
    
    // Buscar postulaciones por aspirante y estado
    List<Postulacion> findByAspiranteIdAndEstado(Long aspiranteId, Estado estado);
    
    // Buscar postulación específica de un aspirante a una oferta
    Optional<Postulacion> findByAspiranteIdAndOfertaId(Long aspiranteId, Long ofertaId);
    
    // Buscar postulaciones por oferta ordenadas por fecha
    List<Postulacion> findByOfertaIdOrderByFechaCreacionDesc(Long ofertaId);
    
    // Buscar postulaciones por oferta y estado ordenadas por fecha
    List<Postulacion> findByOfertaIdAndEstadoOrderByFechaCreacionDesc(Long ofertaId, Estado estado);
}
