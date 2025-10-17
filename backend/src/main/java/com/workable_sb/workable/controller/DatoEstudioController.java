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

import com.workable_sb.workable.dto.DatoEstudioDto;
import com.workable_sb.workable.service.DatoEstudioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/datoestudio")
public class DatoEstudioController {

    @Autowired
    private DatoEstudioService datoEstudioService;

    public DatoEstudioController(DatoEstudioService datoEstudioService) {
        this.datoEstudioService = datoEstudioService;
    }


    @PostMapping("/{id}")
    public ResponseEntity<DatoEstudioDto> crearyupdate(@Valid @RequestBody DatoEstudioDto datoEstudioDto) {
        DatoEstudioDto guardar = datoEstudioService.crearyupdate(datoEstudioDto);
        return ResponseEntity.ok(guardar);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatoEstudioDto> buscarPorId(@PathVariable Integer Est_id) {
        DatoEstudioDto datoEstudioDto = datoEstudioService.buscarPorId(Est_id);
        return ResponseEntity.ok(datoEstudioDto);
    }

    @GetMapping
    public ResponseEntity<List<DatoEstudioDto>> listarTodos() {
        List<DatoEstudioDto> lista = datoEstudioService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer Est_id) {
        datoEstudioService.eliminar(Est_id);
        return ResponseEntity.noContent().build();
    }
}
