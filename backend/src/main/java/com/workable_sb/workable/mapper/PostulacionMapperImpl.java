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
    
    if (postulacionDto.getFecha() != null) {
      LocalDate fechaLocal = postulacionDto.getFecha().toInstant()
        .atZone(ZoneId.systemDefault()).toLocalDate();
      postulacion.setFechaPostulacion(fechaLocal);
    }

    PostulacionEstado estado = estadoRepository.findById(postulacionDto.getEstadoId())
    .orElseThrow(() -> new EntityNotFoundException("Estado no encontrado"));
    postulacion.setPostulacionEstado(estado);

    Oferta oferta = ofertaRepository.findById(postulacionDto.getOfertaId())
    .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
    postulacion.setOferta(oferta);

    UsrAspirante aspirante = aspiranteRepository.findById(postulacionDto.getAspiranteId())
    .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado"));
    postulacion.setAspirante(aspirante);

    return postulacion;

    }

  @Override
  public PostulacionDto toDto(Postulacion entity){
    PostulacionDto dto = new PostulacionDto();
    dto.setId(entity.getId());
    
    if (entity.getFechaPostulacion() != null) {
      dto.setFecha(java.sql.Date.valueOf(entity.getFechaPostulacion()));
    }
    
    if (entity.getPostulacionEstado() != null) {
      dto.setEstadoId(entity.getPostulacionEstado().getId());
      dto.setEstadoNombre(entity.getPostulacionEstado().getNombre());
    }
    
    if (entity.getOferta() != null) {
      dto.setOfertaId(entity.getOferta().getId());
      dto.setOfertaTitulo(entity.getOferta().getTitulo());
    }
    
    if (entity.getAspirante() != null) {
      dto.setAspiranteId(entity.getAspirante().getId());
      dto.setAspiranteNombre(entity.getAspirante().getNombre());
    }
    
    return dto;
  }

}
