package com.workable_sb.workable.controller.oferta;

import com.workable_sb.workable.dto.oferta.OfertaTipoContratoCreateDTO;
import com.workable_sb.workable.models.OfertaTipoContrato;
import com.workable_sb.workable.service.oferta.OfertaTipoContratoService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tipo-contrato")
public class OfertaTipoContratoController {
    private final OfertaTipoContratoService service;

    public OfertaTipoContratoController(OfertaTipoContratoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OfertaTipoContrato>> listarTipoContratos() {
        return ResponseEntity.ok(service.listarTipoContratos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfertaTipoContrato> obtenerTipoContrato(@PathVariable Integer id) {
        return service.obtenerTipoContrato(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OfertaTipoContrato> crearTipoContrato(@Valid @RequestBody OfertaTipoContratoCreateDTO dto) {
        OfertaTipoContrato creado = service.crearTipoContrato(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfertaTipoContrato> actualizarTipoContrato(@PathVariable Integer id, @Valid @RequestBody OfertaTipoContratoCreateDTO dto) {
        return service.actualizarTipoContrato(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTipoContrato(@PathVariable Integer id) {
        boolean eliminado = service.eliminarTipoContrato(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<OfertaTipoContrato> actualizarEstado(@PathVariable Integer id, @RequestParam("estado") String estadoStr) {
        try {
            OfertaTipoContrato.EstadoTipoContrato estado = OfertaTipoContrato.EstadoTipoContrato.valueOf(estadoStr.toUpperCase());
            return service.actualizarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
