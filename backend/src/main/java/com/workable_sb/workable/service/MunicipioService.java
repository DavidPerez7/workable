package com.workable_sb.workable.service;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.MunicipioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MunicipioService {

    @Autowired
    private MunicipioRepo municipioRepo;

    public List<Municipio> getAll() {
        return municipioRepo.findAll();
    }

    public Municipio getById(Long id) {
        return municipioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
    }

    public Municipio create(Municipio municipio) {
        return municipioRepo.save(municipio);
    }

    public Municipio update(Long id, Municipio municipio) {
        Municipio existing = getById(id);
        existing.setNombre(municipio.getNombre());
        existing.setDepartamento(municipio.getDepartamento());
        return municipioRepo.save(existing);
    }

    public void delete(Long id) {
        municipioRepo.deleteById(id);
    }
}