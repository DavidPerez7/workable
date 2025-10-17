package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Métodos personalizados si son necesarios
}
