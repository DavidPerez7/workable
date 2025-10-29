package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.UsrReclutador;

@Repository
public interface UsrReclutadorRepository extends JpaRepository<UsrReclutador, Integer> {
    
    // Buscar reclutador por correo (heredado de Usuario)
    Optional<UsrReclutador> findByCorreo(String correo);
    
    // Buscar reclutadores por empresa
    List<UsrReclutador> findByEmpresaNitId(Long empresaId);
    
    // Verificar si existe por correo
    boolean existsByCorreo(String correo);
}
