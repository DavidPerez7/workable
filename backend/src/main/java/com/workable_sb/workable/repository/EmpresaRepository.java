package com.workable_sb.workable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workable_sb.workable.models.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByCorreoCorporativo(String correoCorporativo);
}
