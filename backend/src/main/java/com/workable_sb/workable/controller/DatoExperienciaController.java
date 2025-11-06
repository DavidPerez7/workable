package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.dato.DataExperienciaDto;
import com.workable_sb.workable.service.dato.DatoExperienciaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/datoexperiencia")

public class DatoExperienciaController {
    private final DatoExperienciaService datoExperienciaService;

    public DatoExperienciaController(DatoExperienciaService datoExperienciaService) {
        this.datoExperienciaService = datoExperienciaService;
    }

    @PostMapping
    public ResponseEntity<DataExperienciaDto> crearyupdate(@Valid @RequestBody DataExperienciaDto datoDataExperienciaDto) {
        DataExperienciaDto datoDataExperienciaDto2 = datoExperienciaService.crearyupdate(datoDataExperienciaDto);
        return ResponseEntity.ok(datoDataExperienciaDto2);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataExperienciaDto> buscarPorId(@PathVariable Integer id) {
        DataExperienciaDto datoDataExperienciaDto = datoExperienciaService.buscarPorId(id);
        return ResponseEntity.ok(datoDataExperienciaDto);
    }

    @GetMapping
    public ResponseEntity<List<DataExperienciaDto>> listarTodos() {
        List<DataExperienciaDto> lista = datoExperienciaService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        datoExperienciaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
