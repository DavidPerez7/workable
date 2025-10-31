package com.workable_sb.workable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.UsrAspirante;

@Repository
public interface UsrAspiranteRepository extends JpaRepository<UsrAspirante, Integer> {
    Optional<UsrAspirante> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
