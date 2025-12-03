package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Habilidad.TipoHabilidad;

@Repository
public interface HabilidadRepo extends JpaRepository<Habilidad, Long> {
    
    // Buscar habilidad por nombre
    Optional<Habilidad> findByNombre(String nombre);
    
    // Buscar habilidades por tipo (TECNICA, IDIOMA, BLANDA)
    List<Habilidad> findByTipo(TipoHabilidad tipo);
    
    // Buscar habilidades activas
    List<Habilidad> findByIsActive(Boolean isActive);
    
    // Buscar habilidades por tipo y activas
    List<Habilidad> findByTipoAndIsActive(TipoHabilidad tipo, Boolean isActive);
    
    // Buscar habilidades por nombre (búsqueda parcial)
    List<Habilidad> findByNombreContainingIgnoreCase(String nombre);
    
    // Verificar si existe habilidad por nombre
    boolean existsByNombre(String nombre);
}
