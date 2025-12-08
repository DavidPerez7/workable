package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Aspirante;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AspiranteRepo extends JpaRepository<Aspirante, Long> {
    // Buscar aspirante por correo (para login)
    Optional<Aspirante> findByCorreo(String correo);
    
    // Buscar aspirante por nombre
    Optional<Aspirante> findByNombre(String nombre);
}