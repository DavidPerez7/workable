package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.PostulacionDto;
import com.workable_sb.workable.models.PostulacionEstado;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.User;
import com.workable_sb.workable.repository.EstadoRepository;
import com.workable_sb.workable.repository.OfertaRepository;
import com.workable_sb.workable.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class PostulacionMapperImple implements PostulacionMapper{

  private final EstadoRepository estadoRepository;
  private final OfertaRepository ofertaRepository;
  private final UsuarioRepository usuarioRepository;

  public PostulacionMapperImple(EstadoRepository estadoRepository, OfertaRepository ofertaRepository, UsuarioRepository usuarioRepository){
    this.estadoRepository = estadoRepository;
    this.ofertaRepository = ofertaRepository;
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  public Postulacion toEntity(PostulacionDto postulacionDto){

    Postulacion postulacion = new Postulacion();
    postulacion.setPostuacion_id(postulacionDto.getId());
    postulacion.setFecha(postulacionDto.getFech());

    PostulacionEstado estado = estadoRepository.findById(postulacionDto.getEstado_Id())
    .orElseThrow(() -> new EntityNotFoundException("Estado no encontrado"));
    postulacion.setEstado(estado);

    Oferta oferta = ofertaRepository.findById(postulacionDto.getOferta_Id())
    .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
    postulacion.setOferta(oferta);

  User usuario = usuarioRepository.findById(postulacionDto.getAspirante_id())
  .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
  postulacion.setUsuario(usuario);

    return postulacion;

    }

  @Override
  public PostulacionDto toDto(Postulacion entity){
    return new PostulacionDto(
    entity.getPostuacion_id(),
    entity.getFecha(),
    entity.getEstado().getEstado_id(),
    entity.getEstado().getNombre(),
    entity.getOferta().getOferta_id(),
    entity.getOferta().getTitulo(),
  entity.getUsuario().getId(),
  entity.getUsuario().getNombre()
    );
  }

}
