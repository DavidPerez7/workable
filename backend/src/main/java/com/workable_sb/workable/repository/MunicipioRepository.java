package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Municipio;

@Repository
public interface MunicipioRepository extends JpaRepository<Municipio, Integer> {
    
    // Buscar municipios por departamento
    List<Municipio> findByDepartamentoId(Integer departamentoId);
}
