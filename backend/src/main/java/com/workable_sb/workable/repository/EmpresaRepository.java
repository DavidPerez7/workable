package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.workable_sb.workable.models.Empresa;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByNit(String nit);
    
    @Query("SELECT e FROM Empresa e WHERE e.codigoInvitacion = :codigoInvitacion")
    Optional<Empresa> findByCodigoInvitacion(String codigoInvitacion);
    
    boolean existsByNit(String nit);

    // Búsqueda por nombre (case-insensitive)
    @Query("SELECT e FROM Empresa e WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Empresa> findByNombreContaining(@Param("nombre") String nombre);
}