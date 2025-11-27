package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Estudio.NivelEducativo;

@Repository
public interface EstudioRepo extends JpaRepository<Estudio, Long> {
    // Buscar estudios por usuario
    List<Estudio> findByUsuarioId(Long usuarioId);
    
    // Buscar estudios en curso de un usuario
    List<Estudio> findByUsuarioIdAndEnCurso(Long usuarioId, Boolean enCurso);
    
    // Buscar estudios por nivel educativo
    List<Estudio> findByUsuarioIdAndNivelEducativo(Long usuarioId, NivelEducativo nivelEducativo);
}
