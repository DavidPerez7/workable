package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.HojaDeVida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HojaDeVidaRepository extends JpaRepository<HojaDeVida, Integer> {
    List<HojaDeVida> findByAspiranteAspiranteId(Integer aspiranteId);
}
