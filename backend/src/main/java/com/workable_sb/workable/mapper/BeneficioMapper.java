package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.BeneficioCreateDTO;
import com.workable_sb.workable.models.Beneficio;
import org.springframework.stereotype.Component;

@Component
public class BeneficioMapper {
    
    public Beneficio toEntity(BeneficioCreateDTO dto) {
        Beneficio beneficio = new Beneficio();
        beneficio.setNombre(dto.getNombre());
        beneficio.setEstado(dto.getEstado());
        return beneficio;
    }
    
    public BeneficioCreateDTO toDTO(Beneficio beneficio) {
        return new BeneficioCreateDTO(
            beneficio.getNombre(),
            beneficio.getEstado()
        );
    }
}
