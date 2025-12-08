package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.models.UsuarioHabilidad.NivelDominio;

@Repository
public interface UsuarioHabilidadRepo extends JpaRepository<UsuarioHabilidad, Long> {
    
    // Buscar todas las habilidades de un aspirante
    List<UsuarioHabilidad> findByAspiranteId(Long aspiranteId);
    
    // Buscar aspirantes que tienen una habilidad específica
    List<UsuarioHabilidad> findByHabilidadId(Long habilidadId);
    
    // Buscar relación específica aspirante-habilidad
    Optional<UsuarioHabilidad> findByAspiranteIdAndHabilidadId(Long aspiranteId, Long habilidadId);
    
    // Buscar habilidades de un aspirante por nivel de dominio
    List<UsuarioHabilidad> findByAspiranteIdAndNivel(Long aspiranteId, NivelDominio nivel);
    
    // Buscar habilidades activas de un aspirante
    List<UsuarioHabilidad> findByAspiranteIdAndIsActive(Long aspiranteId, Boolean isActive);
    
    // Buscar habilidades de un aspirante por tipo (desde la relación con Habilidad)
    List<UsuarioHabilidad> findByAspiranteIdAndHabilidadTipo(Long aspiranteId, com.workable_sb.workable.models.Habilidad.TipoHabilidad tipo);
    
    // Verificar si un aspirante tiene una habilidad específica
    boolean existsByAspiranteIdAndHabilidadId(Long aspiranteId, Long habilidadId);
    
    // Contar habilidades de un aspirante
    long countByAspiranteId(Long aspiranteId);
}
