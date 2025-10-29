package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.DataEstudio;

@Repository
public interface DataEstudioRepository extends JpaRepository<DataEstudio, Integer> {
    List<DataEstudio> findByUsuarioId(Integer usuarioId);
}
