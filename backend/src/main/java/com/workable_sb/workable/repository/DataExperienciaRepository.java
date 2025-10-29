package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.DataExperiencia;

@Repository
public interface DataExperienciaRepository extends JpaRepository<DataExperiencia, Integer> {
    List<DataExperiencia> findByUsuarioId(Integer usuarioId);
}
