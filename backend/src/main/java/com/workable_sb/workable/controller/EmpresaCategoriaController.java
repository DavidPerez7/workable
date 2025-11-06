package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.empresa.EmpresaCategoriaCreateDTO;
import com.workable_sb.workable.dto.empresa.EmpresaCategoriaReadDTO;
import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.service.empresa.EmpresaCategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresa-categoria")
@RequiredArgsConstructor
public class EmpresaCategoriaController {
    private final EmpresaCategoriaService service;

    @PostMapping
    public ResponseEntity<EmpresaCategoriaReadDTO> create(@Valid @RequestBody EmpresaCategoriaCreateDTO dto) {
        EmpresaCategoriaReadDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaCategoriaReadDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody EmpresaCategoriaCreateDTO dto) {
        EmpresaCategoriaReadDTO updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaCategoriaReadDTO> findById(@PathVariable Integer id) {
        EmpresaCategoriaReadDTO found = service.findById(id);
        return ResponseEntity.ok(found);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaCategoriaReadDTO>> findAll() {
        List<EmpresaCategoriaReadDTO> list = service.findAll();
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<EmpresaCategoriaReadDTO> changeEstado(
            @PathVariable Integer id,
            @RequestParam EmpresaCategoria.EstadoCategoria estado) {
        EmpresaCategoriaReadDTO updated = service.changeEstado(id, estado);
        return ResponseEntity.ok(updated);
    }
}