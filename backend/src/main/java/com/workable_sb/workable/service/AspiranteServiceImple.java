package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.AspiranteDto;
import com.workable_sb.workable.dto.AspiranteReadDto;
import com.workable_sb.workable.dto.LoginDto;
import com.workable_sb.workable.mapper.AspiranteMapper;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.repository.AspiranteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;


import jakarta.persistence.EntityNotFoundException;

@Service
public class AspiranteServiceImple implements AspiranteService{

  private final AspiranteRepository aspiranteRepository;
  private final AspiranteMapper aspiranteMapper;
  private final PasswordEncoder passwordEncoder;

  public AspiranteServiceImple(AspiranteRepository aspiranteRepository, AspiranteMapper aspiranteMapper, PasswordEncoder passwordEncoder){
    this.aspiranteRepository = aspiranteRepository;
    this.aspiranteMapper = aspiranteMapper;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public AspiranteReadDto guardar(AspiranteDto aspiranteDto){
    Aspirante aspirante = aspiranteMapper.consult(aspiranteDto);
    aspirante.setClave(passwordEncoder.encode(aspirante.getClave()));
    Aspirante guardado = aspiranteRepository.save(aspirante);
    return aspiranteMapper.consultReadDto(guardado);
  }
  
      @Override
      public AspiranteReadDto update(Integer id, AspiranteDto aspiranteDto) {
        Aspirante aspirante = aspiranteRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado"));

        // Actualizar campos
        aspirante.setNombre(aspiranteDto.getNom());
        aspirante.setApellido(aspiranteDto.getApe());
        aspirante.setCorreo(aspiranteDto.getCorr());
        aspirante.setUbicacion(aspiranteDto.getUbi());
        aspirante.setTelefono(aspiranteDto.getTel());
        aspirante.setFecha_Nacimiento(aspiranteDto.getFeNa());
        aspirante.setNumero_Doc(aspiranteDto.getNumDoc());
        aspirante.setFoto(aspiranteDto.getFoto());
        if (aspiranteDto.getCla() != null && !aspiranteDto.getCla().isEmpty()) {
          aspirante.setClave(passwordEncoder.encode(aspiranteDto.getCla()));
        }

        // Actualizar relaciones
        aspirante.setMunicipio(
          aspiranteMapper.consult(aspiranteDto).getMunicipio()
        );
        aspirante.setTipDocumento(
          aspiranteMapper.consult(aspiranteDto).getTipDocumento()
        );
        aspirante.setGenero(
          aspiranteMapper.consult(aspiranteDto).getGenero()
        );

        Aspirante actualizado = aspiranteRepository.save(aspirante);
        return aspiranteMapper.consultReadDto(actualizado);
      }

  @Override
  public AspiranteReadDto listId(Integer id){
    return aspiranteRepository.findById(id)
      .map(aspiranteMapper::consultReadDto)
      .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado"));
  }

  @Override
  public List<AspiranteReadDto> listarAll(){
    return aspiranteRepository.findAll()
    .stream()
    .map(aspiranteMapper:: consultReadDto)
    .collect(Collectors.toList());
  }

  @Override
    public void eliminar(Integer id) {
      Aspirante aspirante = aspiranteRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado"));
      aspiranteRepository.delete(aspirante);
  }
  @Override
  public Optional<AspiranteReadDto> login(LoginDto loginDto) {
    return aspiranteRepository.findByCorreo(loginDto.getCorreo())
        .filter(aspirante -> passwordEncoder.matches(loginDto.getClave(), aspirante.getClave()))
        .map(aspiranteMapper::consultReadDto);
}

}
