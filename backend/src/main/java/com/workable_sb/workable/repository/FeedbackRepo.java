package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Feedback;

@Repository
public interface FeedbackRepo extends JpaRepository<Feedback, Long> {
    
    // Buscar feedbacks por empresa
    List<Feedback> findByEmpresaId(Long empresaId);
    
    // Buscar feedbacks por usuario
    List<Feedback> findByUsuarioId(Long usuarioId);
    
    // Buscar feedback específico de un usuario a una empresa
    Optional<Feedback> findByUsuarioIdAndEmpresaId(Long usuarioId, Long empresaId);
    
    // Buscar feedbacks por oferta
    List<Feedback> findByOfertaId(Long ofertaId);
}
