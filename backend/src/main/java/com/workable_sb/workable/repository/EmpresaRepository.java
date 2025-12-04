package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Empresa;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    // Buscar empresas por municipio
    List<Empresa> findByMunicipioId(Long municipioId);
    
    // Buscar empresas por nombre (búsqueda parcial)
    List<Empresa> findByNombreContainingIgnoreCase(String nombre);
    
    // Obtener empresas con mejor puntuación
    @Query("SELECT e FROM Empresa e WHERE e.isActive = true ORDER BY e.puntuacion DESC")
    List<Empresa> findTopByPuntuacion();

    // Buscar empresa por NIT
    Optional<Empresa> findByNit(String nit);
    
    // Verificar si existe empresa con ese NIT
    boolean existsByNit(String nit);
    
    // Buscar empresas activas
    List<Empresa> findByIsActive(Boolean isActive);
}

