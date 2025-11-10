package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.dataestudio.DataEstudioDto;
import com.workable_sb.workable.dto.dataestudio.DataEstudioReadDto;
import com.workable_sb.workable.service.dato.DataEstudioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/dataestudio")
public class DataEstudioController {
    private final DataEstudioService service;

    public DataEstudioController(DataEstudioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DataEstudioReadDto> create(@RequestBody DataEstudioDto dto) {
        return ResponseEntity.status(201).body(service.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataEstudioReadDto> findById(@PathVariable Integer id) {
        DataEstudioReadDto dto = service.findById(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<DataEstudioReadDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DataEstudioReadDto> update(@PathVariable Integer id, @RequestBody DataEstudioDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
