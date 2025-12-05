package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.Experiencia.Estado;

@Repository
public interface ExperienciaRepo extends JpaRepository<Experiencia, Long> {
    // Buscar experiencias por usuario
    List<Experiencia> findByUsuarioId(Long usuarioId);
    
    // Buscar experiencias activas de un usuario
    List<Experiencia> findByUsuarioIdAndEstado(Long usuarioId, Estado estado);
    
    // Buscar experiencias ordenadas por fecha
    List<Experiencia> findByUsuarioIdOrderByFechaInicioDesc(Long usuarioId);
    
    // Contar experiencias por usuario
    long countByUsuarioId(Long usuarioId);
}
