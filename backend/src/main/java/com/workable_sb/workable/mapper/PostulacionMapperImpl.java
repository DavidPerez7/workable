package com.workable_sb.workable.mapper;

import java.time.LocalDate;
import java.time.ZoneId;
import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.PostulacionDto;
import com.workable_sb.workable.models.PostulacionEstado;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.UsrAspirante;
import com.workable_sb.workable.repository.PostulacionEstadoRepository;
import com.workable_sb.workable.repository.OfertaRepository;
import com.workable_sb.workable.repository.UsrAspiranteRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class PostulacionMapperImpl implements PostulacionMapper {

  private final PostulacionEstadoRepository estadoRepository;
  private final OfertaRepository ofertaRepository;
  private final UsrAspiranteRepository aspiranteRepository;

  public PostulacionMapperImpl(PostulacionEstadoRepository estadoRepository, OfertaRepository ofertaRepository, UsrAspiranteRepository aspiranteRepository) {
    this.estadoRepository = estadoRepository;
    this.ofertaRepository = ofertaRepository;
    this.aspiranteRepository = aspiranteRepository;
  }

  @Override
  public Postulacion toEntity(PostulacionDto postulacionDto){

    Postulacion postulacion = new Postulacion();
    postulacion.setId(postulacionDto.getId());
    
    if (postulacionDto.getFech() != null) {
      LocalDate fechaLocal = postulacionDto.getFech().toInstant()
        .atZone(ZoneId.systemDefault()).toLocalDate();
      postulacion.setFechaPostulacion(fechaLocal);
    }

    PostulacionEstado estado = estadoRepository.findById(postulacionDto.getEstado_Id())
    .orElseThrow(() -> new EntityNotFoundException("Estado no encontrado"));
    postulacion.setPostulacionEstado(estado);

    Oferta oferta = ofertaRepository.findById(postulacionDto.getOferta_Id())
    .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
    postulacion.setOferta(oferta);

    UsrAspirante aspirante = aspiranteRepository.findById(postulacionDto.getAspirante_id())
    .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado"));
    postulacion.setAspirante(aspirante);

    return postulacion;

    }

  @Override
  public PostulacionDto toDto(Postulacion entity){
    PostulacionDto dto = new PostulacionDto();
    dto.setId(entity.getId());
    
    if (entity.getFechaPostulacion() != null) {
      dto.setFech(java.sql.Date.valueOf(entity.getFechaPostulacion()));
    }
    
    if (entity.getPostulacionEstado() != null) {
      dto.setEstado_Id(entity.getPostulacionEstado().getId());
      dto.setNombreEstado(entity.getPostulacionEstado().getNombre());
    }
    
    if (entity.getOferta() != null) {
      dto.setOferta_Id(entity.getOferta().getId());
      dto.setNombreOferta(entity.getOferta().getTitulo());
    }
    
    if (entity.getAspirante() != null) {
      dto.setAspirante_id(entity.getAspirante().getId());
      dto.setNombreAspirante(entity.getAspirante().getNombre());
    }
    
    return dto;
  }

}
