package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.dataexperiencia.*;
import com.workable_sb.workable.service.ExperienciaService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/dataexperiencia")
@RequiredArgsConstructor
public class ExperienciaController {
    private final ExperienciaService service;

    @GetMapping
    public ResponseEntity<List<DataExperienciaReadDto>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataExperienciaReadDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<DataExperienciaReadDto> create(@Valid @RequestBody DataExperienciaCreateDto dto) {
        DataExperienciaReadDto created = service.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DataExperienciaReadDto> update(@PathVariable Integer id, @Valid @RequestBody DataExperienciaUpdateDto dto) {
        DataExperienciaReadDto updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<DataExperienciaReadDto> changeEstado(@PathVariable Integer id, @RequestParam String estado) {
        DataExperienciaReadDto updated = service.changeEstado(id, estado);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
