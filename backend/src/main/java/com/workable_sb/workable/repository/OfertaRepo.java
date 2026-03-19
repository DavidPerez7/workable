package com.workable_sb.workable.repository;

import java.util.List;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.Modalidad;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.models.Oferta.NivelExperiencia;
import com.workable_sb.workable.dto.OfertaSummaryDTO;
import com.workable_sb.workable.models.Empresa;

@Repository
public interface OfertaRepo extends JpaRepository<Oferta, Long> {

    // BÚSQUEDA UNIFICADA CON FILTROS COMBINABLES
    @Query("SELECT DISTINCT o FROM Oferta o LEFT JOIN o.empresa e WHERE o.estado = :estado" +
            " AND (:nombre IS NULL OR LOWER(o.titulo) LIKE LOWER(CONCAT('%', :nombre, '%')))" +
            " AND (:municipioId IS NULL OR o.municipio.id = :municipioId)" +
            " AND (:salarioMin IS NULL OR o.salario >= :salarioMin)" +
            " AND (:salarioMax IS NULL OR o.salario <= :salarioMax)" +
            " AND (:experiencia IS NULL OR o.nivelExperiencia = :experiencia)" +
            " AND (:modalidad IS NULL OR o.modalidad = :modalidad)" +
            " AND (:categoria IS NULL OR :categoria MEMBER OF e.categories)" +
            " AND (:empresaId IS NULL OR e.id = :empresaId)")
    List<Oferta> buscarConFiltros(
            @Param("nombre") String nombre,
            @Param("municipioId") Long municipioId,
            @Param("salarioMin") BigDecimal salarioMin,
            @Param("salarioMax") BigDecimal salarioMax,
            @Param("experiencia") NivelExperiencia experiencia,
            @Param("modalidad") Modalidad modalidad,
            @Param("categoria") Empresa.Category categoria,
            @Param("empresaId") Long empresaId,
            @Param("estado") EstadoOferta estado);

    // CONSULTA OPTIMIZADA PARA CARDS (solo campos necesarios)
    @Query("SELECT NEW com.workable_sb.workable.dto.OfertaSummaryDTO(" +
            "o.id, o.titulo, e.nombre, m.nombre, o.salario, o.modalidad, o.tipoContrato, CAST(o.estado AS string), o.puntuacion) " +
            "FROM Oferta o JOIN o.empresa e JOIN o.municipio m " +
            "WHERE o.estado = :estado")
    List<OfertaSummaryDTO> findAllSummaryByEstado(@Param("estado") EstadoOferta estado);
}
