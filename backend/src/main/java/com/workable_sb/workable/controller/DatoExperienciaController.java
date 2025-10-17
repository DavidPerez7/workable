package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.DatoExperienciaDto;
import com.workable_sb.workable.service.DatoExperienciaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/datoexperiencia")
public class DatoExperienciaController {

    @Autowired
    private DatoExperienciaService datoExperienciaService;

    public DatoExperienciaController(DatoExperienciaService datoExperienciaService) {
        this.datoExperienciaService = datoExperienciaService;
    }


    @PostMapping
    public ResponseEntity<DatoExperienciaDto> crearyupdate(@Valid @RequestBody DatoExperienciaDto datoExperienciaDto) {
        DatoExperienciaDto datoExperienciaDto2 = datoExperienciaService.crearyupdate(datoExperienciaDto);
        return ResponseEntity.ok(datoExperienciaDto2);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatoExperienciaDto> buscarPorId(@PathVariable Integer experiencia_id) {
        DatoExperienciaDto datoExperienciaDto = datoExperienciaService.buscarPorId(experiencia_id);
        return ResponseEntity.ok(datoExperienciaDto);
    }

    @GetMapping
    public ResponseEntity<List<DatoExperienciaDto>> listarTodos() {
        List<DatoExperienciaDto> lista = datoExperienciaService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer experiencia_id) {
        datoExperienciaService.eliminar(experiencia_id);
        return ResponseEntity.noContent().build();
    }
}
