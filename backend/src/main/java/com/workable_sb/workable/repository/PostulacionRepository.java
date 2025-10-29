package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Postulacion;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Integer> {
    
    // Buscar postulaciones por oferta
    List<Postulacion> findByOfertaId(Integer ofertaId);
    
    // Buscar postulaciones por aspirante
    List<Postulacion> findByAspiranteId(Integer aspiranteId);
    
    // Buscar postulaciones por estado
    List<Postulacion> findByPostulacionEstadoId(Short estadoId);
    
    // Buscar postulaciones por oferta y estado
    List<Postulacion> findByOfertaIdAndPostulacionEstadoId(Integer ofertaId, Short estadoId);
    
    // Verificar si un aspirante ya postuló a una oferta
    boolean existsByAspiranteIdAndOfertaId(Integer aspiranteId, Integer ofertaId);
    
    // Buscar postulación específica de un aspirante a una oferta
    Optional<Postulacion> findByAspiranteIdAndOfertaId(Integer aspiranteId, Integer ofertaId);
}
