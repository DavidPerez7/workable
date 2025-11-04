package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Modalidad;
import com.workable_sb.workable.repository.ModalidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/modalidad")
public class ModalidadController {
    @Autowired
    private ModalidadRepository modalidadRepository;

    @GetMapping
    public ResponseEntity<List<Modalidad>> listarModalidades() {
        return ResponseEntity.ok(modalidadRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Modalidad> obtenerModalidad(@PathVariable Integer id) {
        return modalidadRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Modalidad> crearModalidad(@RequestBody Modalidad modalidad) {
        Modalidad creada = modalidadRepository.save(modalidad);
        return ResponseEntity.ok(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Modalidad> actualizarModalidad(@PathVariable Integer id, @RequestBody Modalidad modalidad) {
        return modalidadRepository.findById(id)
            .map(m -> {
                m.setNombre(modalidad.getNombre());
                Modalidad actualizada = modalidadRepository.save(m);
                return ResponseEntity.ok(actualizada);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarModalidad(@PathVariable Integer id) {
        if (!modalidadRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        modalidadRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
