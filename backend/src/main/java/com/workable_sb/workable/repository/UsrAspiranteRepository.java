package com.workable_sb.workable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.UsrAspirante;

@Repository
public interface UsrAspiranteRepository extends JpaRepository<UsrAspirante, Integer> {
    
    // Buscar aspirante por correo (heredado de Usuario)
    Optional<UsrAspirante> findByCorreo(String correo);
    
    // Verificar si existe por correo
    boolean existsByCorreo(String correo);
}
