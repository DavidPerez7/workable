package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Oferta;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Integer> {
    
    // Buscar ofertas por empresa
    List<Oferta> findByEmpresaNitId(Long empresaId);
    
    // Buscar ofertas por estado
    List<Oferta> findByEstado(String estado);
    
    // Buscar ofertas por empresa y estado
    List<Oferta> findByEmpresaNitIdAndEstado(Long empresaId, String estado);
    
    // Buscar ofertas por reclutador
    List<Oferta> findByReclutadorId(Integer reclutadorId);
    
    // Buscar ofertas por municipio
    List<Oferta> findByMunicipioId(Integer municipioId);
    
    // Buscar ofertas por modalidad
    List<Oferta> findByModalidadId(Integer modalidadId);
    
    // Buscar ofertas que contengan texto en título o descripción
    @Query("SELECT o FROM Oferta o WHERE LOWER(o.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(o.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Oferta> buscarPorTexto(@Param("texto") String texto);
}
