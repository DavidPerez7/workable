package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.dto.OfertaDTO;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.repository.EmpresaRepo;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.OfertaRepo;

@Service
@Transactional
public class OfertaService {

    @Autowired
    private EmpresaRepo empresaRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    public Oferta crearOferta(OfertaDTO dto) {
        Oferta oferta = new Oferta();
        oferta.setTitulo(dto.titulo);
        oferta.setDescripcion(dto.descripcion);
        oferta.setFechaLimite(dto.fechaLimite);
        oferta.setSalario(dto.salario);
        oferta.setNumeroVacantes(dto.numeroVacantes);
        if (dto.nivelExperiencia != null)
            oferta.setNivelExperiencia(Oferta.NivelExperiencia.valueOf(dto.nivelExperiencia));
        if (dto.estado != null)
            oferta.setEstado(Oferta.EstadoOferta.valueOf(dto.estado));
        oferta.setRequisitos(dto.requisitos);
        if (dto.municipioId != null)
            oferta.setMunicipio(municipioRepo.findById(dto.municipioId).orElse(null));
        if (dto.modalidad != null)
            oferta.setModalidad(Oferta.Modalidad.valueOf(dto.modalidad));
        if (dto.tipoContrato != null)
            oferta.setTipoContrato(Oferta.TipoContrato.valueOf(dto.tipoContrato));
        if (dto.empresaId != null)
            oferta.setEmpresa(empresaRepo.findById(dto.empresaId).orElse(null));
        if (dto.beneficios != null && !dto.beneficios.isEmpty()) {
            java.util.Set<Oferta.Beneficio> enumSet = new java.util.HashSet<>();
            for (String b : dto.beneficios) {
                enumSet.add(Oferta.Beneficio.valueOf(b));
            }
            oferta.setBeneficios(enumSet);
        }
        return ofertaRepository.save(oferta);
    }

    @Autowired
    private OfertaRepo ofertaRepository;


    // GET ALL
    public List<Oferta> listarTodas() {
        return ofertaRepository.findAll();
    }

    // GET BY ID
    public Oferta obtenerPorId(Long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada con id: " + id));
    }

    // UPDATE
    public Oferta actualizarOferta(Long id, Oferta ofertaActualizada) {
        Oferta existente = obtenerPorId(id);
        existente.setTitulo(ofertaActualizada.getTitulo());
        existente.setDescripcion(ofertaActualizada.getDescripcion());
        existente.setFechaLimite(ofertaActualizada.getFechaLimite());
        existente.setSalario(ofertaActualizada.getSalario());
        existente.setNumeroVacantes(ofertaActualizada.getNumeroVacantes());
        existente.setNivelExperiencia(ofertaActualizada.getNivelExperiencia());
        existente.setModalidad(ofertaActualizada.getModalidad());
        existente.setTipoContrato(ofertaActualizada.getTipoContrato());
        existente.setRequisitos(ofertaActualizada.getRequisitos());
        existente.setBeneficios(ofertaActualizada.getBeneficios());
        existente.setMunicipio(ofertaActualizada.getMunicipio());
        existente.setEmpresa(ofertaActualizada.getEmpresa());
        // habilidadesRequeridas eliminado
        return ofertaRepository.save(existente);
    }

    // DELETE
    public void eliminarOferta(Long id) {
        Oferta existente = obtenerPorId(id);
        ofertaRepository.delete(existente);
    }
}

