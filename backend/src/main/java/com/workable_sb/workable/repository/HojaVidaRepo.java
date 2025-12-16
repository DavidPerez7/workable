package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.HojaVida;

@Repository
public interface HojaVidaRepo extends JpaRepository<HojaVida, Long> {
    
    // Buscar hoja de vida por aspirante (getbyaspirante)
    List<HojaVida> findByAspiranteId(Long aspiranteId);
}
