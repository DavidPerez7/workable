package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Empresa;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    
    // Buscar empresas por categoría
    List<Empresa> findByEmpresaCategoriaId(Integer categoriaId);
    
    // Buscar empresas por municipio
    List<Empresa> findByMunicipioId(Integer municipioId);
    
    // Buscar empresas por nombre (búsqueda parcial)
    List<Empresa> findByNombreContainingIgnoreCase(String nombre);
    
    // Obtener empresas con mejor puntuación
    @Query("SELECT e FROM Empresa e ORDER BY e.puntuacion DESC")
    List<Empresa> findTopByPuntuacion();
}
