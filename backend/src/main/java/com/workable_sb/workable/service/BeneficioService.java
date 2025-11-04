package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.BeneficioCreateDTO;
import com.workable_sb.workable.mapper.BeneficioMapper;
import com.workable_sb.workable.models.Beneficio;
import com.workable_sb.workable.models.Beneficio.EstadoBeneficio;
import com.workable_sb.workable.repository.BeneficioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficioService {
    
    private final BeneficioRepository beneficioRepository;
    private final BeneficioMapper beneficioMapper;
    
    public List<Beneficio> listarBeneficios() {
        return beneficioRepository.findAll();
    }
    
    public Beneficio obtenerBeneficio(Short id) {
        return beneficioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Beneficio no encontrado con id: " + id));
    }
    
    @Transactional
    public Beneficio crearBeneficio(BeneficioCreateDTO dto) {
        Beneficio beneficio = beneficioMapper.toEntity(dto);
        return beneficioRepository.save(beneficio);
    }
    
    @Transactional
    public Beneficio actualizarBeneficio(Short id, BeneficioCreateDTO dto) {
        Beneficio beneficio = obtenerBeneficio(id);
        beneficio.setNombre(dto.getNombre());
        beneficio.setEstado(dto.getEstado());
        return beneficioRepository.save(beneficio);
    }
    
    @Transactional
    public void eliminarBeneficio(Short id) {
        Beneficio beneficio = obtenerBeneficio(id);
        beneficioRepository.delete(beneficio);
    }
    
    @Transactional
    public Beneficio actualizarEstado(Short id, EstadoBeneficio estado) {
        Beneficio beneficio = obtenerBeneficio(id);
        beneficio.setEstado(estado);
        return beneficioRepository.save(beneficio);
    }
}
