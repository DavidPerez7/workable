package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Experiencia;

@Repository
public interface ExperienciaRepo extends JpaRepository<Experiencia, Integer> {
    List<Experiencia> findByUsuarioId(Integer usuarioId);
}
