package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Postulacion;

@Repository
public interface PostulacionRepo extends JpaRepository<Postulacion, Integer> {
    
    List<Postulacion> findByOferta(Integer ofertaId);
    List<Postulacion> findByAspirante(Integer aspiranteId);
    List<Postulacion> findByOfertaAndPostulacionEstado(Integer ofertaId, Short estadoId);
    boolean existsByAspiranteIdAndOfertaId(Integer aspiranteId, Integer ofertaId);
    
    // Buscar postulación específica de un aspirante a una oferta
    Optional<Postulacion> findByAspiranteIdAndOfertaId(Integer aspiranteId, Integer ofertaId);
}
