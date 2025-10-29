package com.workable_sb.workable.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Genero;

@Repository
public interface GeneroRepository extends JpaRepository<Genero, Short> {
    
}
