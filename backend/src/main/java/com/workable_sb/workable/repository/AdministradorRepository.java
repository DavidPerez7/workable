package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    // Métodos personalizados si son necesarios
}
