package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.HojaVida;

@Repository
public interface HojaVidaRepo extends JpaRepository<HojaVida, Long> {
    
    // Buscar hoja de vida por aspirante
    List<HojaVida> findByAspiranteId(Long aspiranteId);
    
    // Buscar hojas de vida públicas
    List<HojaVida> findByEsPublicaTrue();
    
    // Contar hojas de vida de un aspirante
    long countByAspiranteId(Long aspiranteId);
}
