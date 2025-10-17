package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.OfertaDto;
import com.workable_sb.workable.dto.OfertaReadDto;
import com.workable_sb.workable.mapper.OfertaMapper;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.repositories.OfertaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class OfertaServiceImple implements OfertaService{

    private final OfertaRepository ofertaRepository;
    private final OfertaMapper ofertaMapper;

    public OfertaServiceImple(OfertaRepository ofertaRepository, OfertaMapper ofertaMapper){
        this.ofertaRepository = ofertaRepository;
        this.ofertaMapper = ofertaMapper;
    }

    @Override
    public OfertaReadDto guardar(OfertaDto ofertaDto){
        Oferta oferta = ofertaMapper.consult(ofertaDto);
        Oferta guardado = ofertaRepository.save(oferta);
        return ofertaMapper.consulReadDto(guardado);
    }

    @Override
    public OfertaReadDto ListId(Integer id){
        return ofertaRepository.findById(id)
        .map(ofertaMapper:: consulReadDto)
        .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
    }

    @Override
    public List<OfertaReadDto> listarAll(){
        return ofertaRepository.findAll()
        .stream()
        .map(ofertaMapper:: consulReadDto)
        .collect(Collectors.toList());
    }

    @Override
    public void eliminar(Integer id){
        ofertaRepository.deleteById(id);
    }
}
