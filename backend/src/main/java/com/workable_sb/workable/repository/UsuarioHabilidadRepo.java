package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.models.UsuarioHabilidad.NivelDominio;

@Repository
public interface UsuarioHabilidadRepo extends JpaRepository<UsuarioHabilidad, Long> {
    
    // Buscar todas las habilidades de un usuario
    List<UsuarioHabilidad> findByUsuarioId(Long usuarioId);
    
    // Buscar usuarios que tienen una habilidad específica
    List<UsuarioHabilidad> findByHabilidadId(Long habilidadId);
    
    // Buscar relación específica usuario-habilidad
    Optional<UsuarioHabilidad> findByUsuarioIdAndHabilidadId(Long usuarioId, Long habilidadId);
    
    // Buscar habilidades de un usuario por nivel de dominio
    List<UsuarioHabilidad> findByUsuarioIdAndNivel(Long usuarioId, NivelDominio nivel);
    
    // Buscar habilidades activas de un usuario
    List<UsuarioHabilidad> findByUsuarioIdAndIsActive(Long usuarioId, Boolean isActive);
    
    // Buscar habilidades de un usuario por tipo (desde la relación con Habilidad)
    List<UsuarioHabilidad> findByUsuarioIdAndHabilidadTipo(Long usuarioId, com.workable_sb.workable.models.Habilidad.TipoHabilidad tipo);
    
    // Verificar si un usuario tiene una habilidad específica
    boolean existsByUsuarioIdAndHabilidadId(Long usuarioId, Long habilidadId);
    
    // Contar habilidades de un usuario
    long countByUsuarioId(Long usuarioId);
}
