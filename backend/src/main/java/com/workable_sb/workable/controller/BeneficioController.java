package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.BeneficioCreateDTO;
import com.workable_sb.workable.models.Beneficio;
import com.workable_sb.workable.models.Beneficio.EstadoBeneficio;
import com.workable_sb.workable.service.BeneficioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficio")
@RequiredArgsConstructor
public class BeneficioController {
    
    private final BeneficioService beneficioService;
    
    @GetMapping
    public ResponseEntity<List<Beneficio>> listarBeneficios() {
        return ResponseEntity.ok(beneficioService.listarBeneficios());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Beneficio> obtenerBeneficio(@PathVariable Short id) {
        return ResponseEntity.ok(beneficioService.obtenerBeneficio(id));
    }
    
    @PostMapping
    public ResponseEntity<Beneficio> crearBeneficio(@Valid @RequestBody BeneficioCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(beneficioService.crearBeneficio(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Beneficio> actualizarBeneficio(
            @PathVariable Short id,
            @Valid @RequestBody BeneficioCreateDTO dto) {
        return ResponseEntity.ok(beneficioService.actualizarBeneficio(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarBeneficio(@PathVariable Short id) {
        beneficioService.eliminarBeneficio(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Beneficio> actualizarEstado(
            @PathVariable Short id,
            @RequestParam EstadoBeneficio estado) {
        return ResponseEntity.ok(beneficioService.actualizarEstado(id, estado));
    }
}

