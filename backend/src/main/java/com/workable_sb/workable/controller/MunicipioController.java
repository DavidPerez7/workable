package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.service.MunicipioService;

@RestController
@RequestMapping("/api/municipios")
public class MunicipioController {

    @Autowired
    private MunicipioService municipioService;

    // CREATE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Municipio municipio) {
        try {
            Municipio municipioCreado = municipioService.create(municipio);
            return ResponseEntity.ok(municipioCreado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear municipio: " + e.getMessage()));
        }
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Municipio> municipios = municipioService.getAll();
            return ResponseEntity.ok(municipios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener municipios: " + e.getMessage()));
        }
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Optional<Municipio> municipio = municipioService.getById(id);
            if (municipio.isPresent()) {
                return ResponseEntity.ok(municipio.get());
            }
            return ResponseEntity.status(404).body(Map.of("error", "Municipio no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener municipio: " + e.getMessage()));
        }
    }

    // GET BY NOMBRE
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> getByNombre(@PathVariable String nombre) {
        try {
            List<Municipio> municipios = municipioService.getByNombre(nombre);
            if (!municipios.isEmpty()) {
                return ResponseEntity.ok(municipios);
            }
            return ResponseEntity.status(404).body(Map.of("error", "No se encontraron municipios con ese nombre"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al buscar municipios: " + e.getMessage()));
        }
    }

    // GET BY DEPARTAMENTO
    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<?> getByDepartamento(@PathVariable Municipio.Departamento departamento) {
        try {
            List<Municipio> municipios = municipioService.getByDepartamento(departamento);
            if (!municipios.isEmpty()) {
                return ResponseEntity.ok(municipios);
            }
            return ResponseEntity.status(404).body(Map.of("error", "No se encontraron municipios en ese departamento"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener municipios: " + e.getMessage()));
        }
    }

    // UPDATE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Municipio municipio) {
        try {
            Municipio municipioActualizado = municipioService.update(id, municipio);
            if (municipioActualizado != null) {
                return ResponseEntity.ok(municipioActualizado);
            }
            return ResponseEntity.status(404).body(Map.of("error", "Municipio no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar municipio: " + e.getMessage()));
        }
    }

    // DELETE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deleted = municipioService.delete(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Municipio eliminado correctamente"));
            }
            return ResponseEntity.status(404).body(Map.of("error", "Municipio no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar municipio: " + e.getMessage()));
        }
    }

}
