package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.NivelEducativoCreateDto;
import com.workable_sb.workable.dto.NivelEducativoDto;
import com.workable_sb.workable.service.NivelEducativoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/nivel-educativo")
public class NivelEducativoController {
    private final NivelEducativoService service;
    public NivelEducativoController(NivelEducativoService service) {
        this.service = service;
    }
    @PostMapping
    public NivelEducativoDto create(@RequestBody NivelEducativoCreateDto dto) {
        return service.create(dto);
    }
    @PutMapping("/{id}")
    public NivelEducativoDto update(@PathVariable Integer id, @RequestBody NivelEducativoDto dto) {
        return service.update(id, dto);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
    @GetMapping("/{id}")
    public NivelEducativoDto findById(@PathVariable Integer id) {
        return service.findById(id);
    }
    @GetMapping
    public List<NivelEducativoDto> findAll() {
        return service.findAll();
    }
    @PatchMapping("/{id}/estado")
    public NivelEducativoDto changeEstado(@PathVariable Integer id, @RequestParam String estado) {
        return service.changeEstado(id, estado);
    }
}
