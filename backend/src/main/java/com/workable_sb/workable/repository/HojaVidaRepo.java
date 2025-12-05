package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.HojaVida;

@Repository
public interface HojaVidaRepo extends JpaRepository<HojaVida, Long> {
    
    // Buscar hojas de vida por usuario
    List<HojaVida> findByUsuarioId(Long usuarioId);
    
    // Buscar hojas de vida activas de un usuario
    List<HojaVida> findByUsuarioIdAndIsActive(Long usuarioId, Boolean isActive);
    
    // Buscar hoja de vida principal de un usuario (puede ser la primera activa)
    Optional<HojaVida> findFirstByUsuarioIdAndIsActiveOrderByFechaCreacionDesc(Long usuarioId, Boolean isActive);
    
    // Buscar hojas de vida públicas
    List<HojaVida> findByEsPublicaAndIsActive(Boolean esPublica, Boolean isActive);
    
    // Buscar hojas de vida por título
    List<HojaVida> findByTituloContainingIgnoreCaseAndIsActive(String titulo, Boolean isActive);
    
    // Verificar si un usuario tiene hoja de vida
    boolean existsByUsuarioIdAndIsActive(Long usuarioId, Boolean isActive);
    
    // Contar hojas de vida de un usuario
    long countByUsuarioId(Long usuarioId);
}
