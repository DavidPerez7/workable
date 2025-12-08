package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Estudio.NivelEducativo;

@Repository
public interface EstudioRepo extends JpaRepository<Estudio, Long> {
    // Buscar estudios por aspirante
    List<Estudio> findByAspiranteId(Long aspiranteId);
    
    // Buscar estudios en curso de un aspirante
    List<Estudio> findByAspiranteIdAndEnCurso(Long aspiranteId, Boolean enCurso);
    
    // Buscar estudios por nivel educativo
    List<Estudio> findByAspiranteIdAndNivelEducativo(Long aspiranteId, NivelEducativo nivelEducativo);
    
    // Contar estudios por aspirante
    long countByAspiranteId(Long aspiranteId);
}
