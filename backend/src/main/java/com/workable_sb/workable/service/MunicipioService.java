package com.workable_sb.workable.service;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.MunicipioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MunicipioService {

    @Autowired
    private MunicipioRepo municipioRepo;

    public List<Municipio> getAll() {
        return municipioRepo.findAll();
    }

    public Municipio getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return municipioRepo.findById(id).orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
    }

    public Municipio create(Municipio municipio) {
        if (municipio == null) {
            throw new IllegalArgumentException("El municipio no puede ser nulo");
        }
        return municipioRepo.save(municipio);
    }

    public Municipio update(Long id, Municipio municipio) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        Municipio existing = getById(id);
        if (existing == null) {
            throw new RuntimeException("Municipio no encontrado");
        }
        existing.setNombre(municipio.getNombre());
        existing.setDepartamento(municipio.getDepartamento());
        return municipioRepo.save(existing);
    }

    public void delete(Long id) {
        if (id == null) return;
        municipioRepo.deleteById(id);
    }
}