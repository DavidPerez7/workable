package com.workable_sb.workable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workable_sb.workable.models.Aspirante;

public interface AspiranteRepository extends JpaRepository <Aspirante, Integer> {
    Optional<Aspirante> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
