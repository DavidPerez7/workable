package com.workable_sb.workable.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workable_sb.workable.models.Postulacion;

public interface PostulacionRepository extends JpaRepository <Postulacion, Integer> {
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Postulacion p WHERE p.aspirante.aspiranteId = :aspiranteId AND p.oferta.oferta_id = :ofertaId")
    boolean existsByAspiranteAndOferta(@Param("aspiranteId") Integer aspiranteId, @Param("ofertaId") Integer ofertaId);
}
