package com.workable_sb.workable.repository;

import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Usuario.Rol;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Buscar usuario por correo (para login)
    Optional<Usuario> findByCorreo(String correo);
    
    // Verificar si existe un correo
    boolean existsByCorreo(String correo);
    
    // Buscar usuario por nombre
    Optional<Usuario> findByNombre(String nombre);
    
    // Buscar usuarios por rol
    List<Usuario> findByRol(Rol rol);
    
    // Buscar usuarios activos
    List<Usuario> findByIsActive(Boolean isActive);
    
    // Buscar usuarios por municipio
    List<Usuario> findByMunicipioId(Integer municipioId);
}
