package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.EmpresaCategoria;

@Repository
public interface EmpresaCategoriaRepo extends JpaRepository<EmpresaCategoria, Long> {
    
    // Buscar categorías activas
    List<EmpresaCategoria> findByIsActive(Boolean isActive);
    
    // Buscar por nombre
    List<EmpresaCategoria> findByNombreContainingIgnoreCase(String nombre);
}
