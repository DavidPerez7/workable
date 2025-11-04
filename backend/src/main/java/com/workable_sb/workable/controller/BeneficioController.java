package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Beneficio;
import com.workable_sb.workable.repository.BeneficioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/beneficio")
public class BeneficioController {
    @Autowired
    private BeneficioRepository beneficioRepository;

    @GetMapping
    public ResponseEntity<List<Beneficio>> listarBeneficios() {
        return ResponseEntity.ok(beneficioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Beneficio> obtenerBeneficio(@PathVariable Short id) {
        return beneficioRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Beneficio> crearBeneficio(@RequestBody Beneficio beneficio) {
        Beneficio creado = beneficioRepository.save(beneficio);
        return ResponseEntity.ok(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Beneficio> actualizarBeneficio(@PathVariable Short id, @RequestBody Beneficio beneficio) {
        return beneficioRepository.findById(id)
            .map(b -> {
                b.setNombre(beneficio.getNombre());
                Beneficio actualizado = beneficioRepository.save(b);
                return ResponseEntity.ok(actualizado);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarBeneficio(@PathVariable Short id) {
        if (!beneficioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        beneficioRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
