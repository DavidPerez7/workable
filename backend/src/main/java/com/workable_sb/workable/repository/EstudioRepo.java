package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Estudio;

@Repository
public interface EstudioRepo extends JpaRepository<Estudio, Integer> {
    List<Estudio> findByUsuarioId(Integer usuarioId);
}
