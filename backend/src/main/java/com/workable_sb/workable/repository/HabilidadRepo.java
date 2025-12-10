package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Habilidad;

@Repository
public interface HabilidadRepo extends JpaRepository<Habilidad, Long> {
    // Buscar habilidades por aspirante ordenadas por nombre
    List<Habilidad> findByAspiranteIdOrderByNombre(Long aspiranteId);
    
    // Buscar habilidades por aspirante
    List<Habilidad> findByAspiranteId(Long aspiranteId);
}
