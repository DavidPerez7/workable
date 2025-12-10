package com.workable_sb.workable.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Reclutador;

@Repository
public interface ReclutadorRepo extends JpaRepository<Reclutador, Long> {
    Optional<Reclutador> findByCorreo(String correo);
    Optional<Reclutador> findByEmpresaId(Long empresaId);
}
