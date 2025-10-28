package com.workable_sb.workable.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workable_sb.workable.models.PostulacionEstado;

public interface EstadoRepository extends JpaRepository<PostulacionEstado, Short> {

}
