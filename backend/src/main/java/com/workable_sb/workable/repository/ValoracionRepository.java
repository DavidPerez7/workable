package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Valoracion;

@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Integer> {
    
    // Buscar valoraciones por empresa
    List<Valoracion> findByEmpresaNitId(Long empresaId);
    
    // Buscar valoraciones por usuario
    List<Valoracion> findByUsuarioId(Integer usuarioId);
    
    // Calcular puntuación promedio de una empresa
    @Query("SELECT AVG(v.puntuacion) FROM Valoracion v WHERE v.empresa.nitId = :empresaId")
    Float calcularPromedioEmpresa(@Param("empresaId") Long empresaId);
    
    // Contar valoraciones de una empresa
    Long countByEmpresaNitId(Long empresaId);
}
