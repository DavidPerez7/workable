package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Feedback;

@Repository
public interface FeedbackRepo extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByEmpresaId(Long empresaId);
    List<Feedback> findByEmpresaIdAndIsActiveTrue(Long empresaId);
    
    List<Feedback> findByUsuarioId(Long usuarioId);
    List<Feedback> findByUsuarioIdAndIsActiveTrue(Long usuarioId);
    
    Optional<Feedback> findByUsuarioIdAndEmpresaId(Long usuarioId, Long empresaId);
    Optional<Feedback> findByUsuarioIdAndEmpresaIdAndIsActiveTrue(Long usuarioId, Long empresaId);
    
    List<Feedback> findByOfertaId(Long ofertaId);
    List<Feedback> findByOfertaIdAndIsActiveTrue(Long ofertaId);
}
