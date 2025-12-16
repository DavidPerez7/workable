package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Postulacion;

@Repository
public interface PostulacionRepo extends JpaRepository<Postulacion, Long> {
    
    // Buscar postulaciones por oferta (getbyoferta)
    List<Postulacion> findByOfertaId(Long ofertaId);
    
    // Buscar postulaciones por aspirante (getbyaspirante)
    List<Postulacion> findByAspiranteId(Long aspiranteId);
    
    // Validar postulación duplicada
    Optional<Postulacion> findByAspiranteIdAndOfertaId(Long aspiranteId, Long ofertaId);
    
    // Contar postulaciones por oferta
    long countByOfertaId(Long ofertaId);
}
