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

    public List<Municipio> obtenerTodos() {
        return municipioRepo.findAll();
    }

    public Municipio obtenerPorId(Long id) {
        return municipioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
    }

    public List<Municipio> obtenerPorDepartamento(Municipio.Departamento departamento) {
        return municipioRepo.findByDepartamento(departamento);
    }

    public List<Municipio> buscarPorNombre(String nombre) {
        return municipioRepo.findByNombreContainingIgnoreCase(nombre);
    }
}