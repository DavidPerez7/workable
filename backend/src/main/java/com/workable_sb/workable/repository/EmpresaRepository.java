package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Empresa;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Optional<Empresa> findById(Long empresaId);
    List<Empresa> findByCategoriaId(Integer categoriaId);
    List<Empresa> findByMunicipioId(Integer municipioId);
    
    @Query("SELECT e FROM Empresa e ORDER BY e.puntuacion DESC")
    List<Empresa> findTopByPuntuacion();
}
