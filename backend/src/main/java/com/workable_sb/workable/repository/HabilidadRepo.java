package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Habilidad.Estado;

@Repository
public interface HabilidadRepo extends JpaRepository<Habilidad, Long> {
    // Buscar habilidades por aspirante
    List<Habilidad> findByAspiranteId(Long aspiranteId);
    
    // Buscar habilidades activas de un aspirante
    List<Habilidad> findByAspiranteIdAndEstado(Long aspiranteId, Estado estado);
    
    // Buscar habilidades ordenadas por nombre
    List<Habilidad> findByAspiranteIdOrderByNombre(Long aspiranteId);
    
    // Buscar habilidades por nombre
    List<Habilidad> findByNombre(String nombre);
}
