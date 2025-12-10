package com.workable_sb.workable.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Administrador;

@Repository
public interface AdministradorRepo extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByCorreo(String correo);
}
