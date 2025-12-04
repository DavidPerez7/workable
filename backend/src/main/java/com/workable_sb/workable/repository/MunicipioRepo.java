package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Municipio;

@Repository
public interface MunicipioRepo extends JpaRepository<Municipio, Long> {
    
    // Buscar municipios por departamento (enum)
    List<Municipio> findByDepartamento(Municipio.Departamento departamento);
    
    // Buscar municipio por nombre
    List<Municipio> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar municipio por nombre exacto
    Optional<Municipio> findByNombre(String nombre);
}
