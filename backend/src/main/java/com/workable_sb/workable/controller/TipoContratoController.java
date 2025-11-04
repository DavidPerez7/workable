package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.TipoContrato;
import com.workable_sb.workable.dto.TipoContratoCreateDTO;
import com.workable_sb.workable.service.TipoContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tipo-contrato")
public class TipoContratoController {
    @Autowired
    private TipoContratoService tipoContratoService;

    @GetMapping
    public ResponseEntity<List<TipoContrato>> listarTipoContratos() {
        return ResponseEntity.ok(tipoContratoService.listarTipoContratos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoContrato> obtenerTipoContrato(@PathVariable Integer id) {
        return tipoContratoService.obtenerTipoContrato(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipoContrato> crearTipoContrato(@Valid @RequestBody TipoContratoCreateDTO dto) {
        TipoContrato creado = tipoContratoService.crearTipoContrato(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoContrato> actualizarTipoContrato(@PathVariable Integer id, @Valid @RequestBody TipoContratoCreateDTO dto) {
        return tipoContratoService.actualizarTipoContrato(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTipoContrato(@PathVariable Integer id) {
        boolean eliminado = tipoContratoService.eliminarTipoContrato(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TipoContrato> actualizarEstado(@PathVariable Integer id, @RequestParam("estado") String estadoStr) {
        try {
            TipoContrato.EstadoTipoContrato estado = TipoContrato.EstadoTipoContrato.valueOf(estadoStr.toUpperCase());
            return tipoContratoService.actualizarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
