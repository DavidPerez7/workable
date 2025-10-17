package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.ReclutadorDto;
import com.workable_sb.workable.dto.ReclutadorReadDto;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repositories.EmpresaRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class ReclutadorMapperImple implements ReclutadorMapper {

    private final EmpresaRepository empresaRepository;

    public ReclutadorMapperImple(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Override
    public Reclutador consult(ReclutadorDto reclutadorDto){
        Reclutador entity = new Reclutador();

        entity.setNombre(reclutadorDto.getNom());
        entity.setClave(reclutadorDto.getClave());
        entity.setCorreo(reclutadorDto.getCorr());
        entity.setTelefono(reclutadorDto.getTel());
        
        Empresa empresa = empresaRepository.findById(reclutadorDto.getEmpresa_id()).orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
        entity.setEmpresa(empresa);

        return entity;
    }

    @Override
    public ReclutadorReadDto consultReadDto(Reclutador reclutador){
        return new ReclutadorReadDto(
            reclutador.getReclutador_id(),
            reclutador.getNombre(),
            reclutador.getClave(),
            reclutador.getCorreo(),
            reclutador.getTelefono(),
            reclutador.getEmpresa().getNitId(),
            reclutador.getEmpresa().getNombre()
        );
    }
}