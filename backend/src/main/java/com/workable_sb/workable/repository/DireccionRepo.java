package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Direccion;

@Repository
public interface DireccionRepo extends JpaRepository<Direccion, Long> {

    List<Direccion> findByEmpresaId(Long empresaId);

    List<Direccion> findByEmpresaIdAndIsPrincipal(Long empresaId, Boolean isPrincipal);
}
