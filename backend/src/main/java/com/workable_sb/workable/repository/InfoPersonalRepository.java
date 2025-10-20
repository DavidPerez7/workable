package com.workable_sb.workable.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workable_sb.workable.models.InfoAspirante;

public interface InfoPersonalRepository extends JpaRepository<InfoAspirante, Integer> {

}
