package com.workable_sb.workable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Empresa;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

}