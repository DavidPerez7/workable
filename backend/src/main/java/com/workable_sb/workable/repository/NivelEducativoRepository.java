package com.workable_sb.workable.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.NivelEducativo;

@Repository
public interface NivelEducativoRepository extends JpaRepository<NivelEducativo, Integer> {

}
