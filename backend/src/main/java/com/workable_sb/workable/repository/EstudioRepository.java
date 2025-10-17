package com.workable_sb.workable.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workable_sb.workable.models.DatoEstudio;

public interface EstudioRepository extends JpaRepository<DatoEstudio, Integer> {

}
