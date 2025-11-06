package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.EmpresaCategoriaDto;
import com.workable_sb.workable.service.EmpresaCategoriaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empresa-categoria")
public class EmpresaCategoriaController {
    private final EmpresaCategoriaService service;
    public EmpresaCategoriaController(EmpresaCategoriaService service) {
        this.service = service;
    }
    @PostMapping
    public EmpresaCategoriaDto create(@RequestBody EmpresaCategoriaDto dto) {
        return service.create(dto);
    }
    @PutMapping("/{id}")
    public EmpresaCategoriaDto update(@PathVariable Integer id, @RequestBody EmpresaCategoriaDto dto) {
        return service.update(id, dto);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
    @GetMapping("/{id}")
    public EmpresaCategoriaDto findById(@PathVariable Integer id) {
        return service.findById(id);
    }
    @GetMapping
    public List<EmpresaCategoriaDto> findAll() {
        return service.findAll();
    }
}
