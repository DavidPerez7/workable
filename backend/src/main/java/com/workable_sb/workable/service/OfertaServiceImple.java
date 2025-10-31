package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.OfertaDto;
import com.workable_sb.workable.mapper.OfertaMapper;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.UsrReclutador;
import com.workable_sb.workable.repository.OfertaRepository;
import com.workable_sb.workable.repository.UsrReclutadorRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class OfertaServiceImple implements OfertaService{

    private final OfertaRepository ofertaRepository;
    private final OfertaMapper ofertaMapper;
    private final UsrReclutadorRepository reclutadorRepository;

    public OfertaServiceImple(OfertaRepository ofertaRepository, OfertaMapper ofertaMapper,
                              UsrReclutadorRepository reclutadorRepository){
        this.ofertaRepository = ofertaRepository;
        this.ofertaMapper = ofertaMapper;
        this.reclutadorRepository = reclutadorRepository;
    }

    @Override
    public OfertaDto guardar(OfertaDto ofertaDto){
        Oferta oferta = ofertaMapper.toEntity(ofertaDto);
        Oferta guardado = ofertaRepository.save(oferta);
        return ofertaMapper.toDto(guardado);
    }

    @Override
    public OfertaDto guardarYVincularReclutador(OfertaDto ofertaDto, String correoReclutador) {
        // Buscar el reclutador por correo
        UsrReclutador reclutador = reclutadorRepository.findByCorreo(correoReclutador)
            .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
        
        // Validar que el reclutador tenga una empresa
        if (reclutador.getEmpresa() == null) {
            throw new IllegalStateException("Debes tener una empresa registrada para crear ofertas");
        }
        
        // Asignar la empresa del reclutador a la oferta
        ofertaDto.setEmpresaId(reclutador.getEmpresa().getNitId());
        ofertaDto.setReclutadorId(reclutador.getId());
        
        // Crear la oferta
        Oferta oferta = ofertaMapper.toEntity(ofertaDto);
        Oferta ofertaGuardada = ofertaRepository.save(oferta);
        
        return ofertaMapper.toDto(ofertaGuardada);
    }

    @Override
    public OfertaDto actualizar(Integer id, OfertaDto ofertaDto, String correoReclutador) {
        // Buscar la oferta
        Oferta oferta = ofertaRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
        
        // Buscar el reclutador autenticado
        UsrReclutador reclutador = reclutadorRepository.findByCorreo(correoReclutador)
            .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
        
        // Validar que el reclutador sea el creador de la oferta o que la oferta pertenezca a su empresa
        if (oferta.getReclutador() != null && !oferta.getReclutador().getId().equals(reclutador.getId())) {
            throw new IllegalStateException("No tienes permisos para actualizar esta oferta");
        }
        
        // Actualizar campos
        oferta.setTitulo(ofertaDto.getTitulo());
        oferta.setDescripcion(ofertaDto.getDescripcion());
        oferta.setUbicacion(ofertaDto.getUbicacion());
        oferta.setFechaLimite(ofertaDto.getFechaLimite());
        oferta.setSalario(ofertaDto.getSalario());
        if (ofertaDto.getEstado() != null) {
            oferta.setEstado(ofertaDto.getEstado());
        }
        
        Oferta actualizada = ofertaRepository.save(oferta);
        return ofertaMapper.toDto(actualizada);
    }

    @Override
    public OfertaDto ListId(Integer id){
        return ofertaRepository.findById(id)
        .map(ofertaMapper::toDto)
        .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
    }

    @Override
    public List<OfertaDto> listarAll(){
        return ofertaRepository.findAll()
        .stream()
        .map(ofertaMapper::toDto)
        .collect(Collectors.toList());
    }

    @Override
    public void eliminar(Integer id, String correoReclutador){
        // Buscar la oferta
        Oferta oferta = ofertaRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
        
        // Buscar el reclutador autenticado
        UsrReclutador reclutador = reclutadorRepository.findByCorreo(correoReclutador)
            .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
        
        // Validar que el reclutador sea el creador de la oferta
        if (oferta.getReclutador() != null && !oferta.getReclutador().getId().equals(reclutador.getId())) {
            throw new IllegalStateException("No tienes permisos para eliminar esta oferta");
        }
        
        ofertaRepository.deleteById(id);
    }
}
