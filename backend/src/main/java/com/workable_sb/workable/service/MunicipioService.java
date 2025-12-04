package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.MunicipioRepo;

@Service
public class MunicipioService {

    @Autowired
    private MunicipioRepo municipioRepo;

    // CREATE
    public Municipio create(Municipio municipio) {
        return municipioRepo.save(municipio);
    }

    // READ ALL
    public List<Municipio> getAll() {
        return municipioRepo.findAll();
    }

    // READ BY ID
    public Optional<Municipio> getById(Long id) {
        return municipioRepo.findById(id);
    }

    // READ BY NOMBRE
    public List<Municipio> getByNombre(String nombre) {
        return municipioRepo.findByNombreContainingIgnoreCase(nombre);
    }

    // READ BY DEPARTAMENTO
    public List<Municipio> getByDepartamento(Municipio.Departamento departamento) {
        return municipioRepo.findByDepartamento(departamento);
    }

    // UPDATE
    public Municipio update(Long id, Municipio municipioActualizado) {
        Optional<Municipio> municipioExistente = municipioRepo.findById(id);
        if (municipioExistente.isPresent()) {
            Municipio municipio = municipioExistente.get();
            if (municipioActualizado.getNombre() != null) {
                municipio.setNombre(municipioActualizado.getNombre());
            }
            if (municipioActualizado.getDepartamento() != null) {
                municipio.setDepartamento(municipioActualizado.getDepartamento());
            }
            return municipioRepo.save(municipio);
        }
        return null;
    }

    // DELETE - Elimina un municipio (BD automáticamente pone NULL en referencias)
    @Transactional
    public boolean delete(Long id) {
        if (municipioRepo.existsById(id)) {
            try {
                municipioRepo.deleteById(id);
                return true;
            } catch (Exception e) {
                System.out.println("Error al eliminar municipio: " + e.getMessage());
                throw new RuntimeException("Error al eliminar municipio: " + e.getMessage(), e);
            }
        }
        return false;
    }
}
