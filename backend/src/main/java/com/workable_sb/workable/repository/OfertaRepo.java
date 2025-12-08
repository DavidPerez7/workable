package com.workable_sb.workable.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Oferta.Modalidad;

@Repository
public interface OfertaRepo extends JpaRepository<Oferta, Long> {
    
    // Buscar ofertas por empresa
    List<Oferta> findByEmpresaId(Long empresaId);
    
    // Buscar ofertas por estado (enum)
    List<Oferta> findByEstado(EstadoOferta estado);
    
    // Buscar ofertas por empresa y estado
    List<Oferta> findByEmpresaIdAndEstado(Long empresaId, EstadoOferta estado);
    
    // Buscar ofertas por municipio
    List<Oferta> findByMunicipioId(Long municipioId);
    
    // Buscar ofertas por modalidad (enum)
    List<Oferta> findByModalidad(Modalidad modalidad);
    
    // Buscar ofertas activas (estado ABIERTA)
    List<Oferta> findByEstadoOrderByFechaPublicacionDesc(EstadoOferta estado);
    
    // Buscar ofertas que contengan texto en título o descripción
    @Query("SELECT o FROM Oferta o WHERE LOWER(o.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(o.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Oferta> buscarPorTexto(@Param("texto") String texto);
}
