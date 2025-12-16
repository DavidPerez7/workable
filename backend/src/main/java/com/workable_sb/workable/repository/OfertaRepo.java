package com.workable_sb.workable.repository;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.Modalidad;

@Repository
public interface OfertaRepo extends JpaRepository<Oferta, Long> {
    
    // getbyempresa - Buscar ofertas por empresa
    List<Oferta> findByEmpresaId(Long empresaId);
    
    // getbyubicacion - Buscar ofertas por municipio
    List<Oferta> findByMunicipioId(Long municipioId);
    
    // getbyhorarios - Buscar ofertas por modalidad
    List<Oferta> findByModalidad(Modalidad modalidad);
    
    // getbynombre - Buscar ofertas por texto en título o descripción
    @Query("SELECT o FROM Oferta o WHERE LOWER(o.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(o.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Oferta> buscarPorTexto(@Param("texto") String texto);
    
    // getbysalario - Buscar ofertas por rango de salario
    @Query("SELECT o FROM Oferta o WHERE o.salario BETWEEN :salarioMinimo AND :salarioMaximo")
    List<Oferta> findBySalarioRange(@Param("salarioMinimo") BigDecimal salarioMinimo, @Param("salarioMaximo") BigDecimal salarioMaximo);
    
    // getbyexprequerida - Buscar ofertas por nivel de experiencia
    List<Oferta> findByNivelExperiencia(String nivelExperiencia);
    
    // Métodos auxiliares para búsqueda por título exacto
    @Query("SELECT o FROM Oferta o WHERE LOWER(o.titulo) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Oferta> findByTituloContainingIgnoreCase(@Param("nombre") String nombre);
    
    // Buscar ofertas activas por empresa
    @Query("SELECT o FROM Oferta o WHERE o.empresa.id = :empresaId AND o.isActive = true")
    List<Oferta> findByEmpresaIdAndActive(@Param("empresaId") Long empresaId);
}
