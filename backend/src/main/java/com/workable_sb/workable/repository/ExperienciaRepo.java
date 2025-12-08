package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.Experiencia.Estado;

@Repository
public interface ExperienciaRepo extends JpaRepository<Experiencia, Long> {
    // Buscar experiencias por aspirante
    List<Experiencia> findByAspiranteId(Long aspiranteId);
    
    // Buscar experiencias activas de un aspirante
    List<Experiencia> findByAspiranteIdAndEstado(Long aspiranteId, Estado estado);
    
    // Buscar experiencias ordenadas por fecha
    List<Experiencia> findByAspiranteIdOrderByFechaInicioDesc(Long aspiranteId);
    
    // Contar experiencias por aspirante
    long countByAspiranteId(Long aspiranteId);
}
