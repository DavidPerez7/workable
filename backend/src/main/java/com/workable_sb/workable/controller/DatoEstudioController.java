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

import com.workable_sb.workable.dto.dato.DataEstudioDto;
import com.workable_sb.workable.service.dato.DatoEstudioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/datoestudio")

public class DatoEstudioController {
    private final DatoEstudioService datoEstudioService;

    public DatoEstudioController(DatoEstudioService datoEstudioService) {
        this.datoEstudioService = datoEstudioService;
    }

    @PostMapping
    public ResponseEntity<DataEstudioDto> crearyupdate(@Valid @RequestBody DataEstudioDto datoDataEstudioDto) {
        DataEstudioDto guardar = datoEstudioService.crearyupdate(datoDataEstudioDto);
        return ResponseEntity.ok(guardar);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataEstudioDto> buscarPorId(@PathVariable Integer id) {
        DataEstudioDto datoDataEstudioDto = datoEstudioService.buscarPorId(id);
        return ResponseEntity.ok(datoDataEstudioDto);
    }

    @GetMapping
    public ResponseEntity<List<DataEstudioDto>> listarTodos() {
        List<DataEstudioDto> lista = datoEstudioService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        datoEstudioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
