package com.workable_sb.workable.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Reclutador;
import java.util.List;
import java.util.Optional;

public interface ReclutadorRepository extends JpaRepository<Reclutador, Integer> {

	Optional<Reclutador> findByCorreo(String correo);
	
	List<Reclutador> findAllByEmpresa(Empresa empresa);

}
