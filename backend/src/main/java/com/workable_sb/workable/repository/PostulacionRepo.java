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
    
    // Buscar postulaciones por usuario
    List<Postulacion> findByUsuarioId(Long usuarioId);
    
    // Buscar postulaciones por oferta y estado
    List<Postulacion> findByOfertaIdAndEstado(Long ofertaId, Estado estado);
    
    // Buscar postulaciones por usuario y estado
    List<Postulacion> findByUsuarioIdAndEstado(Long usuarioId, Estado estado);
    
    // Buscar postulación específica de un usuario a una oferta
    Optional<Postulacion> findByUsuarioIdAndOfertaId(Long usuarioId, Long ofertaId);
}
