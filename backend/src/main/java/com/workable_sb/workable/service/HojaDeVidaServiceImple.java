package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.HojaDeVidaDto;
import com.workable_sb.workable.mapper.HojaDeVidaMapper;
import com.workable_sb.workable.models.HojaDeVida;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HojaDeVidaServiceImple implements HojaDeVidaService {
    @Autowired
    private HojaDeVidaMapper hojaDeVidaMapper;
    @Autowired
    private com.workable_sb.workable.repository.HojaDeVidaRepository hojaDeVidaRepository;

    @Override
    public HojaDeVidaDto crearHojaDeVida(HojaDeVidaDto hojaDeVidaDto) {
        var hojaDeVida = hojaDeVidaMapper.toEntity(hojaDeVidaDto);
        var guardada = hojaDeVidaRepository.save(hojaDeVida);
        return hojaDeVidaMapper.toDto(guardada);
    }

    @Override
    public HojaDeVidaDto obtenerHojaDeVidaPorId(Integer id) {
        return hojaDeVidaRepository.findById(id)
            .map(hojaDeVidaMapper::toDto)
            .orElse(null);
    }

    @Override
    public List<HojaDeVidaDto> listarHojasDeVidaPorAspirante(Integer aspiranteId) {
        return hojaDeVidaRepository.findByAspiranteAspiranteId(aspiranteId).stream()
            .map(hojaDeVidaMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public HojaDeVidaDto actualizarHojaDeVida(Integer id, HojaDeVidaDto hojaDeVidaDto) {
        return hojaDeVidaRepository.findById(id)
            .map(hojaDeVida -> {
                hojaDeVida.setTitulo(hojaDeVidaDto.getTitulo());
                hojaDeVida.setDescripcion(hojaDeVidaDto.getDescripcion());
                var actualizada = hojaDeVidaRepository.save(hojaDeVida);
                return hojaDeVidaMapper.toDto(actualizada);
            })
            .orElse(null);
    }

    @Override
    public void eliminarHojaDeVida(Integer id) {
        hojaDeVidaRepository.deleteById(id);
    }
}
