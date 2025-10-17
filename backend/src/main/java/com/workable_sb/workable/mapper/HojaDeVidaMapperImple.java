package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.HojaDeVidaDto;
import com.workable_sb.workable.models.HojaDeVida;

@Component
public class HojaDeVidaMapperImple implements HojaDeVidaMapper {
    @Override
    public HojaDeVidaDto toDto(HojaDeVida hojaDeVida) {
        if (hojaDeVida == null) return null;
        HojaDeVidaDto dto = new HojaDeVidaDto();
        dto.setHojaDeVidaId(hojaDeVida.getHojaDeVidaId());
        dto.setTitulo(hojaDeVida.getTitulo());
        dto.setDescripcion(hojaDeVida.getDescripcion());
        if (hojaDeVida.getAspirante() != null) {
            dto.setAspiranteId(hojaDeVida.getAspirante().getAspiranteId());
        }
        return dto;
    }

    @Override
    public HojaDeVida toEntity(HojaDeVidaDto hojaDeVidaDto) {
        if (hojaDeVidaDto == null) return null;
        HojaDeVida hojaDeVida = new HojaDeVida();
        hojaDeVida.setHojaDeVidaId(hojaDeVidaDto.getHojaDeVidaId());
        hojaDeVida.setTitulo(hojaDeVidaDto.getTitulo());
        hojaDeVida.setDescripcion(hojaDeVidaDto.getDescripcion());
        // La relación con Aspirante debe ser gestionada en el servicio
        return hojaDeVida;
    }
}
